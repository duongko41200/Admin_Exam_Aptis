import express from "express";
import multer from "multer";
import videoUploadController from "../../controllers/videoUploads.controller.js";
import { asyncHandle } from "../../helpers/asyncHandle.js";

const router = express.Router();

// Configure multer for handling video uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB limit
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
 * Video Upload Routes
 * Simplified version for direct video upload
 */

// Get upload configuration
router.get("/config", videoUploadController.getUploadConfig);

// Validate video file
router.post("/validate", videoUploadController.validateVideoFile);

// Upload video directly
router.post(
  "/upload",
  upload.single("video"),
  videoUploadController.uploadVideo
);

// Direct upload routes
router.post(
  "/direct-upload/init",
  videoUploadController.initializeDirectUpload
);
router.post(
  "/direct-upload/complete",
  videoUploadController.completeDirectUpload
);
router.post("/direct-upload/abort", videoUploadController.abortDirectUpload);

// Clean up videos folder and failed uploads
router.post("/cleanup", videoUploadController.cleanupVideos);

export default router;
