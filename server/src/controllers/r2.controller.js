import { SuccessResponse } from "../cores/success.response.js";
import r2Service from "../services/r2.service.js";

/**
 * R2 File Upload Controller
 * Handles all file upload operations with Cloudflare R2
 */
class R2Controller {
  /**
   * Upload single file
   */
  uploadSingle = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { fileType = "general" } = req.body;

      const result = await r2Service.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        fileType
      );

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Upload failed",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: "File uploaded successfully!",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Upload Single Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * Upload multiple files
   */
  uploadMultiple = async (req, res, next) => {
    try {
      // SỬA ĐÚNG: Lấy file từ req.files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const { fileType = "general" } = req.body;

      // Chuẩn hóa files cho service
      const files = req.files.map((file) => ({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      }));

      const result = await r2Service.uploadMultipleFiles(files, fileType);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Upload failed",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: `Files uploaded successfully! ${result.data.totalUploaded} uploaded, ${result.data.totalFailed} failed`,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Upload Multiple Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * Get file information
   */
  getFileInfo = async (req, res, next) => {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          success: false,
          message: "File key is required",
        });
      }

      const result = await r2Service.getFileInfo(key);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: "File not found",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: "File info retrieved successfully!",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Get File Info Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * Generate presigned URL for file access (download)
   */
  getPresignedUrl = async (req, res, next) => {
    try {
      const { key } = req.params;
      const { expiresIn = 3600 } = req.query; // Default 1 hour

      if (!key) {
        return res.status(400).json({
          success: false,
          message: "File key is required",
        });
      }

      const result = await r2Service.getPresignedUrl(key, parseInt(expiresIn));

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: "File not found",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: "Presigned URL generated successfully!",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Get Presigned URL Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * Generate presigned URL for file upload (direct upload)
   */
  getPresignedUploadUrl = async (req, res, next) => {
    try {
      const { fileName, contentType, expiresIn = 3600 } = req.body;
      const userId = req.user?.id || req.body.userId; // Get from auth or request body

      // Validate required fields
      if (!fileName) {
        return res.status(400).json({
          success: false,
          message: "fileName is required",
        });
      }

      if (!contentType) {
        return res.status(400).json({
          success: false,
          message: "contentType is required",
        });
      }

      // Validate file type (only videos for this use case)
      if (!contentType.startsWith("video/")) {
        return res.status(400).json({
          success: false,
          message: "Only video files are allowed",
        });
      }

      const result = await r2Service.getPresignedUploadUrl(
        fileName,
        contentType,
        parseInt(expiresIn),
        userId
      );

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to generate presigned upload URL",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: "Presigned upload URL generated successfully!",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Get Presigned Upload URL Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * Delete file
   */
  deleteFile = async (req, res, next) => {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          success: false,
          message: "File key is required",
        });
      }

      const result = await r2Service.deleteFile(key);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: "File not found or delete failed",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: "File deleted successfully!",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Delete File Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * Delete multiple files
   */
  deleteMultipleFiles = async (req, res, next) => {
    try {
      const { keys } = req.body;

      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        return res.status(400).json({
          success: false,
          message: "File keys array is required",
        });
      }

      const result = await r2Service.deleteMultipleFiles(keys);

      new SuccessResponse({
        message: `Delete operation completed! ${
          result.data?.totalDeleted || 0
        } deleted, ${result.data?.totalFailed || 0} failed`,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Delete Multiple Files Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * List files in directory
   */
  listFiles = async (req, res, next) => {
    try {
      const { prefix = "", maxKeys = 100 } = req.query;

      const result = await r2Service.listFiles(prefix, parseInt(maxKeys));

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "List files failed",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: "Files listed successfully!",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("List Files Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  /**
   * Copy file
   */
  copyFile = async (req, res, next) => {
    try {
      const { sourceKey, destinationKey } = req.body;

      if (!sourceKey || !destinationKey) {
        return res.status(400).json({
          success: false,
          message: "Source key and destination key are required",
        });
      }

      const result = await r2Service.copyFile(sourceKey, destinationKey);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Copy failed",
          error: result.error,
        });
      }

      new SuccessResponse({
        message: "File copied successfully!",
        metadata: result.data,
      }).send(res);
    } catch (error) {
      console.error("Copy File Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}

export default new R2Controller();
