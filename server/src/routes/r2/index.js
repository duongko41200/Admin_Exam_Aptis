"use strict";
import express from "express";
import multer from "multer";
import r2Controller from "../../controllers/r2.controller.js";
import { asyncHandle } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory for direct upload to R2
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10, // Maximum 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Optional: Add file type validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
      "audio/mp3",
      "video/mp4",
      "video/webm",
      "application/pdf",
      "text/plain",
      "application/json",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  },
});

const router = express.Router();

// Authentication middleware
// router.use(authenticationV2);

/**
 * @route POST /r2/upload/single
 * @desc Upload single file to R2
 * @access Private
 * @body fileType - Category of file (listening, speaking, reading, writing, general)
 * @file file - Single file to upload
 */
router.post(
  "/upload/single",
  upload.single("file"),
  asyncHandle(r2Controller.uploadSingle)
);

/**
 * @route POST /r2/upload/multiple
 * @desc Upload multiple files to R2
 * @access Private
 * @body fileType - Category of files (listening, speaking, reading, writing, general)
 * @files files - Multiple files to upload (max 10)
 */
router.post(
  "/upload/multiple",
  upload.array("files", 10),
  asyncHandle(r2Controller.uploadMultiple)
);

/**
 * @route GET /r2/file/info/:key
 * @desc Get file information
 * @access Private
 * @param key - File key/path in R2
 */
router.get("/file/info/:key(*)", asyncHandle(r2Controller.getFileInfo));

/**
 * @route GET /r2/file/presigned/:key
 * @desc Generate presigned URL for file access
 * @access Private
 * @param key - File key/path in R2
 * @query expiresIn - URL expiration in seconds (default: 3600)
 */
router.get(
  "/file/presigned/:key(*)",
  asyncHandle(r2Controller.getPresignedUrl)
);

/**
 * @route DELETE /r2/file/:key
 * @desc Delete single file from R2
 * @access Private
 * @param key - File key/path in R2
 */
router.delete("/file/:key(*)", asyncHandle(r2Controller.deleteFile));

/**
 * @route DELETE /r2/files/multiple
 * @desc Delete multiple files from R2
 * @access Private
 * @body keys - Array of file keys to delete
 */
router.delete("/files/multiple", asyncHandle(r2Controller.deleteMultipleFiles));

/**
 * @route GET /r2/files/list
 * @desc List files in R2 bucket
 * @access Private
 * @query prefix - Directory prefix to filter (optional)
 * @query maxKeys - Maximum number of files to return (default: 100)
 */
router.get("/files/list", asyncHandle(r2Controller.listFiles));

/**
 * @route POST /r2/file/copy
 * @desc Copy file within R2 bucket
 * @access Private
 * @body sourceKey - Source file key
 * @body destinationKey - Destination file key
 */
router.post("/file/copy", asyncHandle(r2Controller.copyFile));

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 100MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 10 files.",
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message.includes("File type")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

export default router;
