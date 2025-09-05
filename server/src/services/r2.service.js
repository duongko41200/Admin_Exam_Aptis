import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2Config from "../configs/r2.config.js";
import crypto from "crypto";
import path from "path";

/**
 * Cloudflare R2 Service
 * Provides CRUD operations for file management
 */
class R2Service {
  constructor() {
    this.client = r2Config.getClient();
    this.bucketName = r2Config.getBucketName();
    this.publicUrl = r2Config.getPublicUrl();
  }

  /**
   * Generate unique filename with timestamp and random hash
   * @param {string} originalName - Original filename
   * @returns {string} - Unique filename
   */
  generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString("hex");
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);

    // Clean filename (remove special characters)
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "_");

    return `${timestamp}_${randomHash}_${cleanBaseName}${extension}`;
  }

  /**
   * Generate file path based on type and date
   * @param {string} fileType - Type of file (listening, speaking, reading, writing, general)
   * @param {string} filename - Filename
   * @returns {string} - Full file path
   */
  generateFilePath(fileType = "general", filename) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${fileType}/${year}/${month}/${filename}`;
  }

  /**
   * Upload file to R2
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} originalName - Original filename
   * @param {string} mimeType - File MIME type
   * @param {string} fileType - Type category (listening, speaking, etc.)
   * @returns {Promise<Object>} - Upload result with file info
   */
  async uploadFile(fileBuffer, originalName, mimeType, fileType = "general") {
    try {
      const uniqueFilename = this.generateUniqueFilename(originalName);
      const filePath = this.generateFilePath(fileType, uniqueFilename);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
        Body: fileBuffer,
        ContentType: mimeType,
        // Set cache control for better performance
        CacheControl: "max-age=31536000", // 1 year
        // Add metadata
        Metadata: {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
          fileType: fileType,
          size: fileBuffer.length.toString(),
        },
      });

      const result = await this.client.send(command);

      return {
        success: true,
        data: {
          key: filePath,
          filename: uniqueFilename,
          originalName: originalName,
          url: `${this.publicUrl}/${filePath}`,
          size: fileBuffer.length,
          mimeType: mimeType,
          fileType: fileType,
          etag: result.ETag,
          uploadedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("R2 Upload Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of file objects {buffer, originalName, mimeType}
   * @param {string} fileType - Type category
   * @returns {Promise<Object>} - Upload results
   */
  async uploadMultipleFiles(files, fileType = "general") {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadFile(file.buffer, file.originalName, file.mimeType, fileType)
      );

      const results = await Promise.all(uploadPromises);

      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      return {
        success: failed.length === 0,
        data: {
          successful: successful.map((r) => r.data),
          failed: failed.map((r) => r.error),
          totalUploaded: successful.length,
          totalFailed: failed.length,
        },
      };
    } catch (error) {
      console.error("R2 Multiple Upload Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get file info
   * @param {string} key - File key/path
   * @returns {Promise<Object>} - File information
   */
  async getFileInfo(key) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const result = await this.client.send(command);

      return {
        success: true,
        data: {
          key: key,
          size: result.ContentLength,
          mimeType: result.ContentType,
          lastModified: result.LastModified,
          etag: result.ETag,
          metadata: result.Metadata,
        },
      };
    } catch (error) {
      console.error("R2 Get File Info Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate presigned URL for direct file access (download)
   * @param {string} key - File key/path
   * @param {number} expiresIn - URL expiration in seconds (default: 1 hour)
   * @returns {Promise<Object>} - Presigned URL
   */
  async getPresignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn });

      return {
        success: true,
        data: {
          url: signedUrl,
          expiresIn: expiresIn,
          expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
        },
      };
    } catch (error) {
      console.error("R2 Presigned URL Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate presigned URL for direct file upload
   * @param {string} fileName - Original file name
   * @param {string} contentType - File MIME type
   * @param {number} expiresIn - URL expiration in seconds (default: 1 hour)
   * @param {string} userId - User ID for file organization (optional)
   * @returns {Promise<Object>} - Presigned upload URL and file info
   */
  async getPresignedUploadUrl(
    fileName,
    contentType,
    expiresIn = 3600,
    userId = null
  ) {
    try {
      console.log("🔧 Generating presigned upload URL:", {
        fileName,
        contentType,
        expiresIn,
        userId,
      });

      // Generate unique file key
      const timestamp = Date.now();
      const randomSuffix = crypto.randomBytes(8).toString("hex");
      const fileExtension = path.extname(fileName);
      const baseName = path.basename(fileName, fileExtension);
      const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");

      // Create organized file path
      const folderPath = userId ? `videos/users/${userId}` : "videos/uploads";
      const key = `${folderPath}/${timestamp}_${sanitizedBaseName}_${randomSuffix}${fileExtension}`;

      console.log("📁 Generated file key:", key);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        // Add CORS-friendly metadata
        Metadata: {
          "upload-type": "direct",
          "original-name": fileName,
          "user-id": userId || "anonymous",
        },
      });

      const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });

      // Generate public URL for accessing the file after upload
      const publicUrl = `${this.publicUrl}/${key}`;

      console.log("✅ Presigned URL generated:", {
        uploadUrl: uploadUrl.substring(0, 100) + "...",
        publicUrl,
        key,
        expiresIn,
      });

      return {
        success: true,
        data: {
          uploadUrl,
          publicUrl,
          key,
          fileName,
          contentType,
          expiresIn,
          expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
        },
      };
    } catch (error) {
      console.error("❌ R2 Presigned Upload URL Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete file from R2
   * @param {string} key - File key/path
   * @returns {Promise<Object>} - Delete result
   */
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);

      return {
        success: true,
        data: {
          key: key,
          deletedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("R2 Delete Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete multiple files
   * @param {Array<string>} keys - Array of file keys
   * @returns {Promise<Object>} - Delete results
   */
  async deleteMultipleFiles(keys) {
    try {
      const deletePromises = keys.map((key) => this.deleteFile(key));
      const results = await Promise.all(deletePromises);

      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      return {
        success: failed.length === 0,
        data: {
          successful: successful.map((r) => r.data),
          failed: failed.map((r) => r.error),
          totalDeleted: successful.length,
          totalFailed: failed.length,
        },
      };
    } catch (error) {
      console.error("R2 Multiple Delete Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * List files in a directory
   * @param {string} prefix - Directory prefix
   * @param {number} maxKeys - Maximum number of keys to return
   * @returns {Promise<Object>} - List of files
   */
  async listFiles(prefix = "", maxKeys = 1000) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const result = await this.client.send(command);

      const files =
        result.Contents?.map((item) => ({
          key: item.Key,
          size: item.Size,
          lastModified: item.LastModified,
          etag: item.ETag,
          url: `${this.publicUrl}/${item.Key}`,
        })) || [];

      return {
        success: true,
        data: {
          files: files,
          count: files.length,
          isTruncated: result.IsTruncated,
          nextContinuationToken: result.NextContinuationToken,
        },
      };
    } catch (error) {
      console.error("R2 List Files Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Copy file within R2
   * @param {string} sourceKey - Source file key
   * @param {string} destinationKey - Destination file key
   * @returns {Promise<Object>} - Copy result
   */
  async copyFile(sourceKey, destinationKey) {
    try {
      const command = new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourceKey}`,
        Key: destinationKey,
      });

      const result = await this.client.send(command);

      return {
        success: true,
        data: {
          sourceKey: sourceKey,
          destinationKey: destinationKey,
          url: `${this.publicUrl}/${destinationKey}`,
          etag: result.ETag,
          copiedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("R2 Copy Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Export singleton instance
export default new R2Service();
