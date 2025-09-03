import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  PutObjectCommand,
  ListMultipartUploadsCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2Config from "../configs/r2.config.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import os from "os";

class VideoUploadService {
  constructor() {
    console.log("🔧 Initializing VideoUploadService...");

    try {
      this.client = r2Config.getClient();
      this.bucketName = r2Config.getBucketName();
      this.config = r2Config.getConfig();

      console.log("✅ VideoUploadService initialized:", {
        bucketName: this.bucketName,
        hasClient: !!this.client,
        hasConfig: !!this.config,
      });
    } catch (error) {
      console.error("❌ Failed to initialize VideoUploadService:", error);
      throw error;
    }

    // Optimized upload configuration
    this.uploadConfig = {
      // Giảm part size để tăng song song cho file 200MB
      minPartSize: 5 * 1024 * 1024, // 5MB
      maxPartSize: 10 * 1024 * 1024, // 10MB (thay vì 15MB)
      multipartThreshold: 20 * 1024 * 1024, // 20MB (thay vì 50MB) - ưu tiên multipart sớm hơn
      maxConcurrency: 20, // 20 uploads song song (tăng từ 15)
      chunkConcurrency: 10, // 10 chunks per batch (tăng từ 8)
      retryAttempts: 5, // Tăng retry cho các part bị lỗi
      timeout: 120000, // 2 minutes per part (tăng từ 60s)
    };

    // Track active uploads for cleanup
    this.activeUploads = new Map();
    this.compressionQueue = new Map();
  }

  /**
   * Calculate optimal part size for maximum performance
   */
  calculatePartSize(fileSize) {
    const { minPartSize, maxPartSize } = this.uploadConfig;

    // Tối ưu part size dựa trên file size - đặc biệt cho 200MB
    let partSize;
    const fileSizeMB = fileSize / (1024 * 1024);

    if (fileSizeMB <= 50) {
      // < 50MB - single upload thường nhanh hơn
      partSize = Math.max(fileSize, minPartSize);
    } else if (fileSizeMB <= 200) {
      // 50-200MB - tối ưu cho file 200MB
      partSize = 8 * 1024 * 1024; // 8MB parts cho upload song song tốt
    } else if (fileSizeMB <= 500) {
      // 200-500MB
      partSize = 10 * 1024 * 1024; // 10MB parts
    } else if (fileSizeMB <= 2048) {
      // 500MB-2GB
      partSize = 15 * 1024 * 1024; // 15MB parts
    } else {
      // >= 2GB
      partSize = Math.min(Math.ceil(fileSize / 5000), maxPartSize); // Max 5000 parts
    }

    // Đảm bảo part size trong giới hạn
    partSize = Math.max(partSize, minPartSize);
    partSize = Math.min(partSize, maxPartSize);

    const totalParts = Math.ceil(fileSize / partSize);
    const concurrentBatches = Math.ceil(
      totalParts / this.uploadConfig.maxConcurrency
    );

    console.log(`📊 Upload plan for ${fileSizeMB.toFixed(1)}MB file:
    - Part size: ${(partSize / 1024 / 1024).toFixed(1)}MB
    - Total parts: ${totalParts}
    - Concurrent batches: ${concurrentBatches}
    - Estimated time: ${concurrentBatches * 3}s`);

    return {
      partSize,
      totalParts,
      minPartSize,
      maxPartSize,
      estimatedTime: concurrentBatches * 3, // 3 seconds per batch
      concurrentBatches,
    };
  }

  /**
   * Compress video before upload to reduce file size and improve speed
   */
  async compressVideo(inputBuffer, fileName, options = {}) {
    return new Promise((resolve, reject) => {
      const tempDir = os.tmpdir();
      const inputPath = path.join(tempDir, `input_${Date.now()}_${fileName}`);
      const outputPath = path.join(
        tempDir,
        `compressed_${Date.now()}_${fileName.replace(/\.[^/.]+$/, ".mp4")}`
      );

      try {
        // Write buffer to temp file
        fs.writeFileSync(inputPath, inputBuffer);

        const {
          crf = 28, // Tăng từ 23 lên 28 để nén mạnh hơn
          preset = "medium",
          maxWidth = 1920,
          maxHeight = 1080,
          targetCompressionRatio = 0.35, // ✅ Target nén xuống 35% (200MB → 70MB)
          codec = "libx264", // Có thể chuyển sang libx265 nếu hỗ trợ
          audioBitrate = "96k", // Giảm audio bitrate
          videoBitrate = null, // Sẽ tính toán dựa trên target
        } = options;

        // ✅ Tính toán target bitrate dựa trên compression ratio
        const originalSizeMB = inputBuffer.length / (1024 * 1024);
        const targetSizeMB = originalSizeMB * targetCompressionRatio;

        // Estimate video duration (assume 2 minutes average, will be refined)
        const estimatedDurationMinutes = 2;
        const targetVideoBitrate = Math.floor(
          ((targetSizeMB * 8 * 1024) / (estimatedDurationMinutes * 60)) * 0.9
        ); // 90% for video, 10% for audio

        console.log(`🎯 Compression targets:
        - Original: ${originalSizeMB.toFixed(1)}MB
        - Target: ${targetSizeMB.toFixed(1)}MB  
        - Target video bitrate: ${targetVideoBitrate}kbps`);

        let ffmpegCommand = ffmpeg(inputPath)
          .setFfmpegPath(ffmpegPath)
          .outputOptions([
            `-c:v ${codec}`, // Video codec
            `-crf ${crf}`, // Quality factor (higher = more compression)
            `-preset ${preset}`, // Encoding speed vs compression
            "-c:a aac", // Audio codec
            `-b:a ${audioBitrate}`, // Audio bitrate
            "-movflags +faststart", // Web optimization
            "-pix_fmt yuv420p", // Pixel format for compatibility

            // ✅ Additional compression options
            "-profile:v high", // H.264 high profile
            "-level 4.0", // H.264 level
            "-refs 4", // Reference frames
            "-bf 3", // B-frames
            "-g 30", // GOP size
            "-sc_threshold 0", // Scene change threshold
            "-keyint_min 30", // Minimum keyframe interval

            // ✅ Rate control for better compression
            "-maxrate 2000k", // Maximum bitrate
            "-bufsize 4000k", // Buffer size
          ]);

        // ✅ Scale video if too large
        if (maxWidth && maxHeight) {
          ffmpegCommand = ffmpegCommand.videoFilters([
            `scale='if(gt(iw,ih),min(${maxWidth},iw),-2)':'if(gt(iw,ih),-2,min(${maxHeight},ih))'`,
            "format=yuv420p",
          ]);
        }

        // ✅ Two-pass encoding for better quality at target size
        if (targetVideoBitrate && targetVideoBitrate > 100) {
          console.log(
            `🔄 Using two-pass encoding with target bitrate: ${targetVideoBitrate}kbps`
          );

          // First pass
          ffmpegCommand.outputOptions([
            "-pass 1",
            `-b:v ${targetVideoBitrate}k`,
            "-f null",
          ]);
        }

        const startTime = Date.now();

        ffmpegCommand
          .output(outputPath)
          .on("start", (commandLine) => {
            console.log("🎬 FFmpeg compression started:", commandLine);
          })
          .on("progress", (progress) => {
            if (progress.percent) {
              console.log(
                `📊 Compression progress: ${Math.floor(progress.percent)}%`
              );
            }
          })
          .on("end", () => {
            const compressionTime = Date.now() - startTime;

            if (!fs.existsSync(outputPath)) {
              reject(new Error("Compressed file was not created"));
              return;
            }

            const originalSize = fs.statSync(inputPath).size;
            const compressedSize = fs.statSync(outputPath).size;
            const compressionRatio =
              (originalSize - compressedSize) / originalSize;
            const actualCompressionPercent = compressionRatio * 100;

            console.log(`✅ Compression completed in ${compressionTime}ms`);
            console.log(`📈 Results:
            - Original: ${(originalSize / 1024 / 1024).toFixed(1)}MB
            - Compressed: ${(compressedSize / 1024 / 1024).toFixed(1)}MB  
            - Reduction: ${actualCompressionPercent.toFixed(1)}%
            - Target was: ${(targetCompressionRatio * 100).toFixed(1)}%`);

            // ✅ Validate compression results
            if (actualCompressionPercent < 30) {
              console.warn(
                `⚠️ Low compression ratio: ${actualCompressionPercent.toFixed(
                  1
                )}%. Consider adjusting settings.`
              );
            } else if (actualCompressionPercent > 80) {
              console.warn(
                `⚠️ Very high compression: ${actualCompressionPercent.toFixed(
                  1
                )}%. Quality may be affected.`
              );
            } else {
              console.log(
                `✅ Good compression achieved: ${actualCompressionPercent.toFixed(
                  1
                )}%`
              );
            }

            // Read compressed file
            const compressedBuffer = fs.readFileSync(outputPath);

            // Cleanup temp files
            try {
              fs.unlinkSync(inputPath);
              fs.unlinkSync(outputPath);
            } catch (cleanupErr) {
              console.warn("⚠️ Cleanup warning:", cleanupErr.message);
            }

            resolve({
              buffer: compressedBuffer,
              originalSize,
              compressedSize,
              compressionRatio,
              compressionTime,
              targetCompressionRatio,
              actualCompressionPercent,
              success: true,
            });
          })
          .on("error", (err) => {
            console.error("❌ FFmpeg compression error:", err);

            // Cleanup temp files
            try {
              if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
              if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            } catch (cleanupErr) {
              console.error("❌ Cleanup error:", cleanupErr);
            }

            reject(new Error(`Video compression failed: ${err.message}`));
          })
          .run();
      } catch (error) {
        console.error("❌ Video compression setup error:", error);

        // Cleanup on setup error
        try {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        } catch (cleanupErr) {
          console.error("❌ Setup cleanup error:", cleanupErr);
        }

        reject(new Error(`Compression setup failed: ${error.message}`));
      }
    });
  }

  /**
   * Generate unique filename for video
   */
  generateVideoFileName(originalName, userId = null, fileType = "videos") {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const extension = originalName.split(".").pop();
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");

    // Lấy ngày tháng hiện tại
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Định dạng lại tên file
    const filename = `${timestamp}_${randomString}_${sanitizedBaseName}.${extension}`;

    // Trả về key theo định dạng yêu cầu
    return `${fileType}/${year}/${month}/${filename}`;
  }

  /**
   * OPTIMIZED: Upload video with compression and multipart optimization
   */
  async uploadVideoOptimized(
    fileBuffer,
    fileName,
    contentType,
    userId = null,
    options = {}
  ) {
    const uploadId = crypto.randomUUID();
    const startTime = Date.now();
    let compressionStats = null; // ✅ Khởi tạo biến

    try {
      console.log(
        `🚀 Starting optimized upload for ${fileName} (${(
          fileBuffer.length /
          1024 /
          1024
        ).toFixed(1)}MB)`
      );

      const {
        enableCompression = true,
        compressionOptions = {},
        enableDirectUpload = false,
        progressCallback = null,
      } = options;

      let finalBuffer = fileBuffer;
      const key = this.generateVideoFileName(fileName, userId);

      // Track upload
      this.activeUploads.set(uploadId, {
        uploadId,
        userId,
        fileName,
        key,
        status: "starting",
        startTime,
        originalSize: fileBuffer.length,
      });

      // ✅ Step 1: Video Compression (if enabled)
      if (enableCompression) {
        console.log("🎬 Compressing video before upload...");

        if (progressCallback) {
          progressCallback({
            stage: "compression",
            progress: 0,
            message: "Starting video compression...",
          });
        }

        try {
          const compressionResult = await this.compressVideo(
            fileBuffer,
            fileName,
            {
              crf: 28, // Tăng CRF để nén mạnh hơn
              preset: "medium",
              targetCompressionRatio: 0.35, // ✅ Target nén xuống 35%
              maxWidth: 1920,
              maxHeight: 1080,
              ...compressionOptions,
            }
          );

          finalBuffer = compressionResult.buffer;
          compressionStats = compressionResult; // ✅ Gán giá trị

          console.log(`✅ Compression completed:
          - Original size: ${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB
          - Compressed size: ${(finalBuffer.length / 1024 / 1024).toFixed(1)}MB
          - Reduction: ${(compressionStats.compressionRatio * 100).toFixed(
            1
          )}%`);

          if (progressCallback) {
            progressCallback({
              stage: "compression",
              progress: 100,
              message: "Video compression completed",
            });
          }
        } catch (compressionError) {
          console.warn(
            "⚠️ Compression failed, uploading original file:",
            compressionError
          );
          finalBuffer = fileBuffer;
          compressionStats = {
            compressionRatio: 0,
            originalSize: fileBuffer.length,
            compressedSize: fileBuffer.length,
            compressionTime: 0,
            error: compressionError.message,
          };
        }
      }

      // Update tracking
      this.activeUploads.set(uploadId, {
        ...this.activeUploads.get(uploadId),
        status: "uploading",
        finalSize: finalBuffer.length,
        compressionStats,
      });

      // ✅ Step 2: Choose upload method based on file size
      let uploadResult;
      const uploadThreshold = this.uploadConfig.multipartThreshold;

      if (finalBuffer.length <= uploadThreshold) {
        console.log("📤 Using single upload for small file");
        uploadResult = await this.uploadVideoSingle(
          finalBuffer,
          key,
          contentType
        );
      } else {
        console.log("📦 Using multipart upload for large file");
        uploadResult = await this.uploadVideoMultipartOptimized(
          finalBuffer,
          key,
          contentType,
          finalBuffer.length,
          progressCallback,
          uploadId
        );
      }

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      // Calculate stats for return
      const totalTime = Date.now() - startTime;
      const speedMBps = fileBuffer.length / 1024 / 1024 / (totalTime / 1000);

      // Update tracking
      this.activeUploads.set(uploadId, {
        ...this.activeUploads.get(uploadId),
        status: "completed",
        endTime: Date.now(),
        uploadResult,
      });

      return {
        success: true,
        data: {
          uploadId,
          fileName,
          url: uploadResult.data.url,
          key: uploadResult.data.key,
          uploadTime: totalTime,
          uploadSpeed: speedMBps,
          compressionStats, // ✅ Đã được khởi tạo
          originalSize: fileBuffer.length,
          finalSize: finalBuffer.length,
          uploadMethod: uploadResult.data.uploadMethod || "single",
        },
      };
    } catch (error) {
      console.error(`❌ Upload failed for ${fileName}:`, error);

      // Update tracking
      this.activeUploads.set(uploadId, {
        ...this.activeUploads.get(uploadId),
        status: "failed",
        error: error.message,
        endTime: Date.now(),
      });

      throw error;
    }
  }

  /**
   * Upload video using single PUT for smaller files
   */
  async uploadVideoSingle(fileBuffer, key, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000", // 1 year
      });

      const response = await this.client.send(command);
      // Sử dụng custom domain, không cần bucket name trong URL
      const publicUrl = `${this.config.publicUrl}/${key}`;

      return {
        success: true,
        data: {
          url: publicUrl,
          key: key,
          bucket: this.bucketName,
          etag: response.ETag,
          size: fileBuffer.length,
        },
      };
    } catch (error) {
      console.error("Single upload error:", error);
      throw error;
    }
  }

  /**
   * OPTIMIZED: Upload video using multipart upload with maximum concurrency
   */
  async uploadVideoMultipartOptimized(
    fileBuffer,
    key,
    contentType,
    fileSize,
    progressCallback = null,
    uploadId = null
  ) {
    let multipartUploadId = null;
    try {
      // Step 1: Initialize multipart upload
      const createCommand = new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000", // 1 year
        Metadata: {
          originalSize: fileSize.toString(),
          uploadId: uploadId || "unknown",
          uploadTime: Date.now().toString(),
        },
      });

      const createResponse = await this.client.send(createCommand);
      multipartUploadId = createResponse.UploadId;

      console.log(`📦 Multipart upload initialized: ${multipartUploadId}`);

      // Step 2: Calculate optimal part size
      const partInfo = this.calculatePartSize(fileSize);
      const { partSize, totalParts } = partInfo;

      console.log(
        `📊 Upload plan: ${totalParts} parts of ${(
          partSize /
          1024 /
          1024
        ).toFixed(1)}MB each`
      );

      // Step 3: Upload parts with controlled concurrency and batching
      const parts = [];
      const { maxConcurrency, chunkConcurrency } = this.uploadConfig;

      // Process parts in batches to control memory usage
      for (
        let batchStart = 0;
        batchStart < totalParts;
        batchStart += chunkConcurrency
      ) {
        const batchEnd = Math.min(batchStart + chunkConcurrency, totalParts);
        const batchPromises = [];

        console.log(
          `🔄 Processing batch ${
            Math.floor(batchStart / chunkConcurrency) + 1
          }/${Math.ceil(totalParts / chunkConcurrency)} (parts ${
            batchStart + 1
          }-${batchEnd})`
        );

        for (let i = batchStart; i < batchEnd; i++) {
          const start = i * partSize;
          const end = Math.min(start + partSize, fileSize);
          const partBuffer = fileBuffer.slice(start, end);
          const partNumber = i + 1;

          // Control concurrency within batch
          if (batchPromises.length >= maxConcurrency) {
            const completedParts = await Promise.all(batchPromises);
            parts.push(...completedParts);
            batchPromises.length = 0; // Clear array

            // Update progress
            if (progressCallback) {
              const progress = Math.floor((parts.length / totalParts) * 100);
              progressCallback({
                stage: "upload",
                progress,
                uploadedParts: parts.length,
                totalParts,
                uploadedBytes: parts.length * partSize,
                totalBytes: fileSize,
              });
            }
          }

          const partPromise = this.uploadPartWithRetry(
            multipartUploadId,
            key,
            partNumber,
            partBuffer
          );
          batchPromises.push(partPromise);
        }

        // Upload remaining parts in current batch
        if (batchPromises.length > 0) {
          const completedParts = await Promise.all(batchPromises);
          parts.push(...completedParts);

          // Update progress
          if (progressCallback) {
            const progress = Math.floor((parts.length / totalParts) * 100);
            progressCallback({
              stage: "upload",
              progress,
              uploadedParts: parts.length,
              totalParts,
              uploadedBytes: Math.min(parts.length * partSize, fileSize),
              totalBytes: fileSize,
            });
          }
        }

        console.log(
          `✅ Batch completed: ${parts.length}/${totalParts} parts uploaded`
        );
      }

      // Step 4: Complete multipart upload
      console.log("🔗 Completing multipart upload...");

      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: multipartUploadId,
        MultipartUpload: {
          Parts: parts
            .sort((a, b) => a.PartNumber - b.PartNumber) // Ensure correct order
            .map((part) => ({
              ETag: part.ETag,
              PartNumber: part.PartNumber,
            })),
        },
      });

      const completeResponse = await this.client.send(completeCommand);
      // Sử dụng custom domain, không cần bucket name trong URL
      const publicUrl = `${this.config.publicUrl}/${key}`;

      console.log(`✅ Multipart upload completed: ${key}`);

      if (progressCallback) {
        progressCallback({ stage: "upload", progress: 100, completed: true });
      }

      return {
        success: true,
        data: {
          url: publicUrl,
          key: key,
          bucket: this.bucketName,
          etag: completeResponse.ETag,
          location: completeResponse.Location,
          size: fileSize,
          uploadMethod: "multipart-optimized",
          totalParts,
          partSize,
        },
      };
    } catch (error) {
      console.error("❌ Optimized multipart upload error:", error);

      // Cleanup failed upload
      if (multipartUploadId) {
        try {
          await this.abortMultipartUpload(multipartUploadId, key);
          console.log(`🧹 Aborted failed upload: ${multipartUploadId}`);
        } catch (abortError) {
          console.error("Failed to abort multipart upload:", abortError);
        }
      }

      throw error;
    }
  }

  /**
   * Upload single part with retry logic
   */
  async uploadPartWithRetry(
    uploadId,
    key,
    partNumber,
    partBuffer,
    retryCount = 0
  ) {
    try {
      const command = new UploadPartCommand({
        Bucket: this.bucketName,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: partBuffer,
      });

      const response = await Promise.race([
        this.client.send(command),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Upload timeout")),
            this.uploadConfig.timeout
          )
        ),
      ]);

      return {
        ETag: response.ETag,
        PartNumber: partNumber,
      };
    } catch (error) {
      if (retryCount < this.uploadConfig.retryAttempts) {
        console.log(
          `🔄 Retrying part ${partNumber} (attempt ${retryCount + 1}/${
            this.uploadConfig.retryAttempts
          })`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retryCount) * 1000)
        ); // Exponential backoff
        return this.uploadPartWithRetry(
          uploadId,
          key,
          partNumber,
          partBuffer,
          retryCount + 1
        );
      }

      console.error(
        `❌ Failed to upload part ${partNumber} after ${this.uploadConfig.retryAttempts} retries:`,
        error
      );
      throw error;
    }
  }

  /**
   * Abort multipart upload
   */
  async abortMultipartUpload(uploadId, key) {
    try {
      const command = new AbortMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
      });

      await this.client.send(command);
      return { success: true };
    } catch (error) {
      console.error("Abort multipart upload error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * LEGACY: Upload video directly using multipart upload for large files
   * Giữ lại để tương thích với code cũ
   */
  async uploadVideo(fileBuffer, fileName, contentType, userId = null) {
    // Redirect to optimized version
    return await this.uploadVideoOptimized(
      fileBuffer,
      fileName,
      contentType,
      userId,
      {
        enableCompression: true,
        compressionOptions: { crf: 23, preset: "medium" },
      }
    );
  }

  /**
   * Generate presigned URLs for direct client upload (multipart)
   */
  async generateDirectUploadUrls(
    fileName,
    fileSize,
    userId = null,
    options = {}
  ) {
    try {
      console.log("🔧 Generating direct upload URLs:", {
        fileName,
        fileSize,
        userId,
        options,
      });

      // Validate inputs
      if (!fileName || !fileSize) {
        throw new Error("fileName and fileSize are required");
      }

      if (!this.client) {
        throw new Error("R2 client not initialized");
      }

      if (!this.bucketName) {
        throw new Error("R2 bucket name not configured");
      }

      const key = this.generateVideoFileName(fileName, userId);
      const { partCount = null, enableCompression = false } = options;

      // Calculate parts if not provided
      let totalParts = partCount;
      if (!totalParts) {
        const partInfo = this.calculatePartSize(fileSize);
        totalParts = partInfo.totalParts;
      }

      console.log("📊 Upload plan:", { key, totalParts, fileSize });

      // Initialize multipart upload
      const createCommand = new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: "video/mp4", // Assume MP4 for direct uploads
        CacheControl: "public, max-age=31536000",
        Metadata: {
          originalSize: fileSize.toString(),
          userId: userId || "anonymous",
          uploadTime: Date.now().toString(),
        },
      });

      console.log("🔧 Creating multipart upload command...");
      const createResponse = await this.client.send(createCommand);

      if (!createResponse.UploadId) {
        throw new Error(
          "Failed to create multipart upload - no UploadId received"
        );
      }

      const uploadId = createResponse.UploadId;
      console.log("✅ Multipart upload created:", uploadId);

      // Generate presigned URLs for each part
      const presignedUrls = [];
      console.log("🔧 Generating presigned URLs for", totalParts, "parts...");

      for (let i = 1; i <= totalParts; i++) {
        try {
          const command = new UploadPartCommand({
            Bucket: this.bucketName,
            Key: key,
            PartNumber: i,
            UploadId: uploadId,
          });

          const signedUrl = await getSignedUrl(this.client, command, {
            expiresIn: 3600, // 1 hour
          });

          if (!signedUrl) {
            throw new Error(`Failed to generate signed URL for part ${i}`);
          }

          presignedUrls.push({
            partNumber: i,
            signedUrl,
          });

          console.log(`✅ Generated signed URL for part ${i}/${totalParts}`);
        } catch (partError) {
          console.error(`❌ Failed to generate URL for part ${i}:`, partError);
          throw new Error(
            `Failed to generate signed URL for part ${i}: ${partError.message}`
          );
        }
      }

      const publicUrl = `${this.config.publicUrl}/${key}`;

      console.log("✅ Generated", presignedUrls.length, "presigned URLs");

      return {
        success: true,
        data: {
          uploadId,
          key,
          publicUrl,
          presignedUrls,
          totalParts,
          expiresIn: 3600,
        },
      };
    } catch (error) {
      console.error("❌ Generate direct upload URLs error:", error);
      return {
        success: false,
        error: error.message,
        details: error.stack,
      };
    }
  }

  /**
   * Complete multipart upload from client
   */
  async completeMultipartUpload(uploadId, key, parts) {
    try {
      // Sort parts by part number
      const sortedParts = parts.sort((a, b) => a.partNumber - b.partNumber);

      const command = new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts.map((part) => ({
            ETag: part.etag,
            PartNumber: part.partNumber,
          })),
        },
      });

      const response = await this.client.send(command);
      // Sử dụng custom domain, không cần bucket name trong URL
      const publicUrl = `${this.config.publicUrl}/${key}`;

      return {
        success: true,
        data: {
          url: publicUrl,
          key: key,
          bucket: this.bucketName,
          etag: response.ETag,
          location: response.Location,
        },
      };
    } catch (error) {
      console.error("Complete multipart upload error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize multipart upload
   */
  async initializeMultipartUpload(fileName, contentType, metadata = {}) {
    try {
      const key = this.generateVideoFileName(fileName, metadata.userId);

      const command = new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000",
        Metadata: {
          ...metadata,
          uploadTime: Date.now().toString(),
        },
      });

      const response = await this.client.send(command);
      // Sử dụng custom domain, không cần bucket name trong URL
      const publicUrl = `${this.config.publicUrl}/${key}`;

      return {
        success: true,
        data: {
          uploadId: response.UploadId,
          key,
          publicUrl,
        },
      };
    } catch (error) {
      console.error("Initialize multipart upload error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate signed URLs for parts
   */
  async generateSignedUrls(uploadId, key, totalParts) {
    try {
      const presignedUrls = [];

      for (let i = 1; i <= totalParts; i++) {
        const command = new UploadPartCommand({
          Bucket: this.bucketName,
          Key: key,
          PartNumber: i,
          UploadId: uploadId,
        });

        const signedUrl = await getSignedUrl(this.client, command, {
          expiresIn: 3600,
        });

        presignedUrls.push({
          partNumber: i,
          signedUrl,
        });
      }

      return {
        success: true,
        data: {
          presignedUrls,
          expiresIn: 3600,
        },
      };
    } catch (error) {
      console.error("Generate signed URLs error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get upload progress (placeholder for tracking)
   */
  async getUploadProgress(uploadId, key) {
    try {
      const upload = this.activeUploads.get(uploadId);

      if (!upload) {
        return {
          success: false,
          error: "Upload not found",
        };
      }

      return {
        success: true,
        data: upload,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update part completion tracking
   */
  async updatePartCompletion(uploadId, partNumber, etag, size = null) {
    try {
      // This is mainly for tracking progress
      // R2 doesn't provide native progress tracking for multipart uploads

      return {
        success: true,
        data: {
          uploadId,
          partNumber,
          etag,
          size,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user uploads (placeholder)
   */
  async getUserUploads(userId, status = null, limit = 10) {
    try {
      // This would typically query a database
      // For now, return active uploads for the user

      const userUploads = Array.from(this.activeUploads.values())
        .filter((upload) => upload.userId === userId)
        .filter((upload) => !status || upload.status === status)
        .slice(0, limit);

      return {
        success: true,
        data: userUploads,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Test R2 connection and configuration
   */
  async testR2Connection() {
    try {
      console.log("🧪 Testing R2 connection...");

      // Test 1: Check configuration
      const configTest = {
        hasClient: !!this.client,
        hasBucketName: !!this.bucketName,
        hasConfig: !!this.config,
        bucketName: this.bucketName,
        endpoint: this.config?.endpoint,
        region: this.config?.region,
      };

      console.log("📋 Config test:", configTest);

      // Test 2: Try to list objects (basic connectivity test)
      try {
        const listCommand = new ListObjectsV2Command({
          Bucket: this.bucketName,
          MaxKeys: 1,
        });

        const listResponse = await this.client.send(listCommand);
        console.log("✅ R2 connectivity test passed");

        return {
          success: true,
          config: configTest,
          connectivity: {
            canList: true,
            response: "Connected successfully",
          },
        };
      } catch (listError) {
        console.error("❌ R2 connectivity test failed:", listError);

        return {
          success: false,
          config: configTest,
          connectivity: {
            canList: false,
            error: listError.message,
          },
        };
      }
    } catch (error) {
      console.error("❌ R2 connection test error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Cleanup expired uploads
   */
  async cleanupExpiredUploads() {
    try {
      const now = Date.now();
      const expiredUploads = [];

      for (const [uploadId, upload] of this.activeUploads.entries()) {
        const age = now - upload.startTime;
        if (age > 24 * 60 * 60 * 1000) {
          // 24 hours
          expiredUploads.push(uploadId);

          // Attempt to abort if still in progress
          if (upload.status === "uploading" && upload.multipartUploadId) {
            try {
              await this.abortMultipartUpload(
                upload.multipartUploadId,
                upload.key
              );
            } catch (abortError) {
              console.error(
                `Failed to abort expired upload ${uploadId}:`,
                abortError
              );
            }
          }

          this.activeUploads.delete(uploadId);
        }
      }

      return {
        success: true,
        data: {
          cleanedCount: expiredUploads.length,
          cleanedUploads: expiredUploads,
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  /**
   * Validate video file with enhanced checks
   */
  validateVideoFile(fileName, contentType, fileSize) {
    const allowedMimeTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      "video/ogg",
      "video/x-ms-wmv",
      "video/x-flv",
    ];

    const allowedExtensions = [
      ".mp4",
      ".mpeg",
      ".mpg",
      ".mov",
      ".avi",
      ".webm",
      ".ogv",
      ".wmv",
      ".flv",
      ".mkv",
    ];

    const maxFileSize = 5 * 1024 * 1024 * 1024; // 5GB
    const minFileSize = 1024; // 1KB

    // Check MIME type
    if (!allowedMimeTypes.includes(contentType)) {
      return {
        valid: false,
        error: `Invalid file type '${contentType}'. Allowed types: ${allowedMimeTypes.join(
          ", "
        )}`,
      };
    }

    // Check file extension
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
    if (!allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Invalid file extension '${extension}'. Allowed extensions: ${allowedExtensions.join(
          ", "
        )}`,
      };
    }

    // Check file size
    if (fileSize > maxFileSize) {
      return {
        valid: false,
        error: `File too large (${(fileSize / 1024 / 1024 / 1024).toFixed(
          1
        )}GB). Maximum size: ${maxFileSize / (1024 * 1024 * 1024)}GB`,
      };
    }

    if (fileSize < minFileSize) {
      return {
        valid: false,
        error: `File too small (${fileSize} bytes). Minimum size: ${minFileSize} bytes`,
      };
    }

    // Additional checks for optimal compression
    const recommendations = [];
    if (fileSize > 200 * 1024 * 1024) {
      // > 200MB
      recommendations.push(
        "Consider enabling compression to reduce upload time"
      );
    }

    if (fileSize > 1024 * 1024 * 1024) {
      // > 1GB
      recommendations.push(
        "Large file detected - multipart upload will be used automatically"
      );
    }

    return {
      valid: true,
      fileSize,
      fileName,
      contentType,
      recommendations,
    };
  }

  /**
   * Clean up videos folder and abort failed multipart uploads
   */
  async cleanupVideosFolder(options = {}) {
    const {
      deleteAllVideos = false,
      abortOngoingUploads = true,
      deleteExpiredOnly = true,
      olderThanHours = 24,
    } = options;

    const results = {
      deletedVideos: 0,
      abortedUploads: 0,
      errors: [],
      details: {
        deletedFiles: [],
        abortedUploadIds: [],
      },
    };

    try {
      // 1. Abort ongoing/failed multipart uploads
      if (abortOngoingUploads) {
        console.log("🧹 Cleaning up ongoing multipart uploads...");

        const listUploadsCommand = new ListMultipartUploadsCommand({
          Bucket: this.bucketName,
          Prefix: "videos/", // Chỉ cleanup trong folder videos
        });

        const uploadsResponse = await this.client.send(listUploadsCommand);

        if (uploadsResponse.Uploads && uploadsResponse.Uploads.length > 0) {
          const now = Date.now();

          for (const upload of uploadsResponse.Uploads) {
            const uploadAge = now - new Date(upload.Initiated).getTime();
            const shouldAbort =
              !deleteExpiredOnly || uploadAge > olderThanHours * 3600 * 1000;

            if (shouldAbort) {
              try {
                await this.abortMultipartUpload(upload.UploadId, upload.Key);
                results.abortedUploads++;
                results.details.abortedUploadIds.push(upload.UploadId);
                console.log(
                  `✅ Aborted upload: ${upload.Key} (${upload.UploadId})`
                );
              } catch (error) {
                console.error(
                  `❌ Failed to abort upload ${upload.UploadId}:`,
                  error
                );
                results.errors.push(
                  `Failed to abort ${upload.UploadId}: ${error.message}`
                );
              }
            }
          }
        }
      }

      // 2. Delete video files if requested
      if (deleteAllVideos || deleteExpiredOnly) {
        console.log("🗑️ Cleaning up video files...");

        const listObjectsCommand = new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: "videos/",
        });

        const objectsResponse = await this.client.send(listObjectsCommand);

        if (objectsResponse.Contents && objectsResponse.Contents.length > 0) {
          const now = Date.now();

          for (const object of objectsResponse.Contents) {
            const objectAge = now - new Date(object.LastModified).getTime();
            const shouldDelete =
              deleteAllVideos ||
              (deleteExpiredOnly && objectAge > olderThanHours * 3600 * 1000);

            if (shouldDelete) {
              try {
                const deleteCommand = new DeleteObjectCommand({
                  Bucket: this.bucketName,
                  Key: object.Key,
                });

                await this.client.send(deleteCommand);
                results.deletedVideos++;
                results.details.deletedFiles.push(object.Key);
                console.log(`✅ Deleted file: ${object.Key}`);
              } catch (error) {
                console.error(`❌ Failed to delete ${object.Key}:`, error);
                results.errors.push(
                  `Failed to delete ${object.Key}: ${error.message}`
                );
              }
            }
          }
        }
      }

      // 3. Clean up local tracking
      this.activeUploads.clear();
      this.compressionQueue.clear();

      console.log(`✅ Cleanup completed:
        - Aborted uploads: ${results.abortedUploads}
        - Deleted videos: ${results.deletedVideos}
        - Errors: ${results.errors.length}`);

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      console.error("❌ Cleanup operation failed:", error);
      return {
        success: false,
        error: error.message,
        data: results,
      };
    }
  }
}

export default new VideoUploadService();
