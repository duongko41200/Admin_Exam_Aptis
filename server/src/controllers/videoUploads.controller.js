import { SuccessResponse } from "../cores/success.response.js";
import {
  BadRequestError,
  InternalServerError,
} from "../cores/Error.response.js";
import videoUploadService from "../services/videoUploads.service.js";

/**
 * Video Upload Controller
 * Handles multipart video upload operations with Cloudflare R2
 */
class VideoUploadController {
  /**
   * Initialize multipart upload for video
   * POST /api/video/upload/init
   */
  initializeUpload = async (req, res, next) => {
    try {
      const {
        fileName,
        contentType,
        fileSize,
        userId,
        metadata = {},
      } = req.body;

      // Validate required fields
      if (!fileName || !contentType || !fileSize) {
        throw new BadRequestError(
          "Missing required fields: fileName, contentType, fileSize"
        );
      }

      // Validate file size is a number
      const fileSizeNum = parseInt(fileSize);
      if (isNaN(fileSizeNum) || fileSizeNum <= 0) {
        throw new BadRequestError("Invalid file size");
      }

      // Validate video file
      const validation = videoUploadService.validateVideoFile(
        fileName,
        contentType,
        fileSizeNum
      );
      if (!validation.valid) {
        throw new BadRequestError(validation.error);
      }

      // Calculate optimal part size
      const partInfo = videoUploadService.calculatePartSize(fileSizeNum);

      // Initialize multipart upload
      const uploadMetadata = {
        userId: userId || req.user?.id,
        fileSize: fileSizeNum,
        ...metadata,
      };
      console.log("test đã vào;::");
      const result = await videoUploadService.initializeMultipartUpload(
        fileName,
        contentType,
        uploadMetadata
      );

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Multipart upload initialized successfully",
        metadata: {
          ...result.data,
          partInfo,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Generate signed URLs for multipart upload
   * POST /api/video/upload/signed-urls
   */
  generateSignedUrls = async (req, res, next) => {
    try {
      const { uploadId, key, totalParts } = req.body;

      // Validate required fields
      if (!uploadId || !key || !totalParts) {
        throw new BadRequestError(
          "Missing required fields: uploadId, key, totalParts"
        );
      }

      // Validate totalParts
      const partsNum = parseInt(totalParts);
      if (isNaN(partsNum) || partsNum <= 0 || partsNum > 10000) {
        throw new BadRequestError(
          "Invalid totalParts. Must be between 1 and 10000"
        );
      }

      const result = await videoUploadService.generateSignedUrls(
        uploadId,
        key,
        partsNum
      );

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Signed URLs generated successfully",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Complete multipart upload
   * POST /api/video/upload/complete
   */
  completeUpload = async (req, res, next) => {
    try {
      const { uploadId, key, parts } = req.body;

      // Validate required fields
      if (!uploadId || !key || !parts || !Array.isArray(parts)) {
        throw new BadRequestError(
          "Missing required fields: uploadId, key, parts (array)"
        );
      }

      // Validate parts array
      if (parts.length === 0) {
        throw new BadRequestError("Parts array cannot be empty");
      }

      // Validate each part has required fields
      for (const part of parts) {
        if (!part.partNumber || !part.etag) {
          throw new BadRequestError("Each part must have partNumber and etag");
        }
      }

      // Sort parts by partNumber to ensure correct order
      const sortedParts = parts.sort((a, b) => a.partNumber - b.partNumber);

      const result = await videoUploadService.completeMultipartUpload(
        uploadId,
        key,
        sortedParts
      );

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Video upload completed successfully",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Abort multipart upload
   * POST /api/video/upload/abort
   */
  abortUpload = async (req, res, next) => {
    try {
      const { uploadId, key } = req.body;

      // Validate required fields
      if (!uploadId || !key) {
        throw new BadRequestError("Missing required fields: uploadId, key");
      }

      const result = await videoUploadService.abortMultipartUpload(
        uploadId,
        key
      );

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Multipart upload aborted successfully",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get upload progress (placeholder for future R2 support)
   * GET /api/video/upload/progress/:uploadId/:key
   */
  getUploadProgress = async (req, res, next) => {
    try {
      const { uploadId, key } = req.params;

      if (!uploadId || !key) {
        throw new BadRequestError("Missing required parameters: uploadId, key");
      }

      const result = await videoUploadService.getUploadProgress(uploadId, key);

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Upload progress retrieved",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Calculate optimal part size for a given file size
   * POST /api/video/upload/part-size
   */
  calculatePartSize = async (req, res, next) => {
    try {
      const { fileSize } = req.body;

      if (!fileSize) {
        throw new BadRequestError("Missing required field: fileSize");
      }

      const fileSizeNum = parseInt(fileSize);
      if (isNaN(fileSizeNum) || fileSizeNum <= 0) {
        throw new BadRequestError("Invalid file size");
      }

      const partInfo = videoUploadService.calculatePartSize(fileSizeNum);

      new SuccessResponse({
        message: "Part size calculated successfully",
        metadata: partInfo,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Validate video file before upload
   * POST /api/video/upload/validate
   */
  validateVideoFile = async (req, res, next) => {
    try {
      const { fileName, contentType, fileSize } = req.body;

      if (!fileName || !contentType || !fileSize) {
        throw new BadRequestError(
          "Missing required fields: fileName, contentType, fileSize"
        );
      }

      const fileSizeNum = parseInt(fileSize);
      if (isNaN(fileSizeNum) || fileSizeNum <= 0) {
        throw new BadRequestError("Invalid file size");
      }

      const validation = videoUploadService.validateVideoFile(
        fileName,
        contentType,
        fileSizeNum
      );

      if (validation.valid) {
        new SuccessResponse({
          message: "Video file is valid",
          metadata: {
            valid: true,
            fileName,
            contentType,
            fileSize: fileSizeNum,
          },
        }).send(res);
      } else {
        throw new BadRequestError(validation.error);
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get upload configuration and limits
   * GET /api/video/upload/config
   */
  getUploadConfig = async (req, res, next) => {
    try {
      const config = {
        allowedMimeTypes: [
          "video/mp4",
          "video/mpeg",
          "video/quicktime",
          "video/x-msvideo",
          "video/webm",
          "video/ogg",
        ],
        allowedExtensions: [".mp4", ".mpeg", ".mov", ".avi", ".webm", ".ogv"],
        maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
        minFileSize: 1024, // 1KB
        minPartSize: 5 * 1024 * 1024, // 5MB
        maxPartSize: 100 * 1024 * 1024, // 100MB
        maxParts: 10000,
        signedUrlExpiration: 3600, // 1 hour
        chunkUploadConcurrency: 3, // Recommended concurrent uploads
      };

      new SuccessResponse({
        message: "Upload configuration retrieved successfully",
        metadata: config,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update part completion
   * POST /api/video/upload/part-complete
   */
  updatePartCompletion = async (req, res, next) => {
    try {
      const { uploadId, partNumber, etag, size } = req.body;

      if (!uploadId || !partNumber || !etag) {
        throw new BadRequestError(
          "Missing required fields: uploadId, partNumber, etag"
        );
      }

      const partNum = parseInt(partNumber);
      if (isNaN(partNum) || partNum <= 0) {
        throw new BadRequestError("Invalid partNumber");
      }

      const result = await videoUploadService.updatePartCompletion(
        uploadId,
        partNum,
        etag,
        size ? parseInt(size) : null
      );

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Part completion updated successfully",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user uploads
   * GET /api/video/upload/user/:userId
   */
  getUserUploads = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { status, limit = 10 } = req.query;

      if (!userId) {
        throw new BadRequestError("Missing required parameter: userId");
      }

      const result = await videoUploadService.getUserUploads(
        userId,
        status,
        parseInt(limit)
      );

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "User uploads retrieved successfully",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Simple direct video upload with optimization
   * POST /api/video/upload
   */
  uploadVideo = async (req, res, next) => {
    try {
      if (!req.file) {
        throw new BadRequestError("No video file provided");
      }

      const { originalname, mimetype, size, buffer } = req.file;
      const userId = req.body.userId || req.user?.id;

      // Parse compression options from request
      const enableCompression =
        req.body.enableCompression === "true" ||
        req.body.enableCompression === true;
      const compressionOptions = {
        crf: parseInt(req.body.crf) || 23,
        preset: req.body.preset || "medium",
        maxWidth: parseInt(req.body.maxWidth) || 1920,
        maxHeight: parseInt(req.body.maxHeight) || 1080,
      };

      console.log(
        `🎬 Uploading video: ${originalname} (${(size / 1024 / 1024).toFixed(
          1
        )}MB)`
      );

      // Validate video file
      const validation = videoUploadService.validateVideoFile(
        originalname,
        mimetype,
        size
      );
      if (!validation.valid) {
        throw new BadRequestError(validation.error);
      }

      // Use optimized upload service
      const uploadResult = await videoUploadService.uploadVideoOptimized(
        buffer,
        originalname,
        mimetype,
        userId,
        {
          enableCompression,
          compressionOptions,
          progressCallback: (progress) => {
            // Could implement WebSocket progress updates here
            console.log(`Upload progress: ${JSON.stringify(progress)}`);
          },
        }
      );

      if (!uploadResult.success) {
        throw new InternalServerError(uploadResult.error || "Upload failed");
      }

      // Validate compression results if enabled
      if (
        uploadResult.data.compressionStats &&
        uploadResult.data.compressionStats.success
      ) {
        const { compressionStats } = uploadResult.data;
        const actualReduction =
          compressionStats.actualCompressionPercent ||
          compressionStats.compressionRatio * 100;

        if (actualReduction < 20) {
          console.warn(
            `⚠️ Low compression achieved: ${actualReduction.toFixed(1)}%`
          );
        }

        // Add compression info to response
        uploadResult.data.compressionInfo = {
          originalSizeMB: (compressionStats.originalSize / 1024 / 1024).toFixed(
            1
          ),
          compressedSizeMB: (
            compressionStats.compressedSize /
            1024 /
            1024
          ).toFixed(1),
          reductionPercent: actualReduction.toFixed(1),
          compressionTimeSeconds: (
            compressionStats.compressionTime / 1000
          ).toFixed(1),
        };
      }

      new SuccessResponse({
        message: "Video uploaded successfully with optimization",
        metadata: {
          ...uploadResult.data,
          validation: validation,
          uploadMethod: "optimized",
          performance: {
            uploadTime: uploadResult.data.uploadTime,
            uploadSpeed: uploadResult.data.uploadSpeed,
            compressionStats: uploadResult.data.compressionStats,
          },
        },
      }).send(res);
    } catch (error) {
      console.error("Upload video error:", error);
      next(error);
    }
  };

  /**
   * Initialize direct upload with presigned URLs
   * POST /api/video/upload/direct/init
   */
  initializeDirectUpload = async (req, res, next) => {
    try {
      const { fileName, fileSize, userId, partCount } = req.body;

      if (!fileName || !fileSize) {
        throw new BadRequestError(
          "Missing required fields: fileName, fileSize"
        );
      }

      const fileSizeNum = parseInt(fileSize);
      if (isNaN(fileSizeNum) || fileSizeNum <= 0) {
        throw new BadRequestError("Invalid file size");
      }

      // Validate file
      const validation = videoUploadService.validateVideoFile(
        fileName,
        "video/mp4", // Assume MP4 for direct uploads
        fileSizeNum
      );

      if (!validation.valid) {
        throw new BadRequestError(validation.error);
      }

      // Generate direct upload URLs
      const result = await videoUploadService.generateDirectUploadUrls(
        fileName,
        fileSizeNum,
        userId,
        { partCount }
      );

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Direct upload initialized successfully",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cleanup expired uploads (admin only)
   * POST /api/video/upload/cleanup
   */
  cleanupExpiredUploads = async (req, res, next) => {
    try {
      const result = await videoUploadService.cleanupExpiredUploads();

      if (!result.success) {
        throw new InternalServerError(result.error);
      }

      new SuccessResponse({
        message: "Cleanup completed successfully",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Clean up videos folder and failed uploads
   * POST /api/video/cleanup
   */
  cleanupVideos = async (req, res, next) => {
    try {
      console.log("🧹 Starting cleanup process...", req.body);

      const {
        deleteAllVideos = false,
        abortOngoingUploads = true,
        deleteExpiredOnly = true,
        olderThanHours = 24,
      } = req.body;

      const result = await videoUploadService.cleanupVideosFolder({
        deleteAllVideos,
        abortOngoingUploads,
        deleteExpiredOnly,
        olderThanHours,
      });

      console.log("🧹 Cleanup result:", result);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Cleanup failed",
          error: result.error,
          data: result.data,
        });
      }

      res.status(200).json({
        success: true,
        message: "Cleanup completed successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("❌ Cleanup controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during cleanup",
        error: error.message,
      });
    }
  };
}

export default new VideoUploadController();
