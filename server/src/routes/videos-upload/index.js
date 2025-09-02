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

export default router;
