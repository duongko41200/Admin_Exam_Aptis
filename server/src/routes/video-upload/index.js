import express from "express";
import multer from "multer";
import videoUploadController from "../../controllers/videoUploads.controller.js";
import { asyncHandle } from "../../helpers/asyncHandle.js";

const router = express.Router();

// Configure multer for handling video uploads with optimized settings
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB limit
    fieldSize: 25 * 1024 * 1024, // 25MB for other fields
    fields: 20, // Number of non-file fields
    parts: 1000, // Total number of parts
  },
  fileFilter: (req, file, cb) => {
    // Allow video files only
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

/**
 * Optimized Video Upload Routes
 * Supports multipart upload, compression, and direct upload
 */

// Get upload configuration
router.get("/config", asyncHandle(videoUploadController.getUploadConfig));

// Test R2 connection
router.get("/test-r2", asyncHandle(videoUploadController.testR2Connection));

// Test R2 connection
router.get("/test", asyncHandle(videoUploadController.testR2Connection));

// Validate video file before upload
router.post("/validate", asyncHandle(videoUploadController.validateVideoFile));

// Calculate optimal part size for a file
router.post("/part-size", asyncHandle(videoUploadController.calculatePartSize));

// Upload video directly with optimization (compression + multipart)
router.post(
  "/upload",
  upload.single("video"),
  asyncHandle(videoUploadController.uploadVideo)
);

// Direct upload endpoints (client uploads directly to R2)
router.post(
  "/direct-upload/init",
  asyncHandle(videoUploadController.initializeDirectUpload)
);
router.post(
  "/direct-upload/complete",
  asyncHandle(videoUploadController.completeDirectUpload)
);
router.post(
  "/direct-upload/abort",
  asyncHandle(videoUploadController.abortDirectUpload)
);

// Multipart upload endpoints
router.post("/init", asyncHandle(videoUploadController.initializeUpload));
router.post(
  "/signed-urls",
  asyncHandle(videoUploadController.generateSignedUrls)
);
router.post("/complete", asyncHandle(videoUploadController.completeUpload));
router.post("/abort", asyncHandle(videoUploadController.abortUpload));

// Progress tracking
router.get(
  "/progress/:uploadId/:key",
  asyncHandle(videoUploadController.getUploadProgress)
);
router.post(
  "/part-complete",
  asyncHandle(videoUploadController.updatePartCompletion)
);

// User uploads management
router.get("/user/:userId", asyncHandle(videoUploadController.getUserUploads));

// Admin cleanup
router.post(
  "/cleanup",
  asyncHandle(videoUploadController.cleanupExpiredUploads)
);

export default router;
