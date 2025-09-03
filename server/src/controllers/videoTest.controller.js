import { SuccessResponse } from "../cores/success.response.js";
import { BadRequestError } from "../cores/Error.response.js";

/**
 * Video Test Controller for debugging upload performance
 */
class VideoTestController {
  /**
   * Test endpoint to check upload configuration
   * GET /api/video/test/config
   */
  getTestConfig = async (req, res, next) => {
    try {
      const testConfig = {
        server: {
          maxFileSize: "5GB",
          timeout: "30 minutes",
          bodyParserLimit: "50MB",
          multerLimits: {
            fileSize: "5GB",
            fieldSize: "25MB",
            fields: 20,
            parts: 1000,
          },
        },
        client: {
          axiosTimeout: "10 minutes",
          uploadTimeout: "30 minutes",
          progressCallback: "enabled",
        },
        upload: {
          multipartThreshold: "20MB",
          partSize: "8MB for 200MB files",
          maxConcurrency: 20,
          chunkConcurrency: 10,
          retryAttempts: 5,
          partTimeout: "2 minutes",
        },
        compression: {
          enabled: true,
          targetRatio: "35%",
          crf: 28,
          preset: "medium",
          for200MB: "Expected ~70MB output",
        },
      };

      new SuccessResponse({
        message: "Video upload test configuration",
        metadata: {
          testConfig,
          tips: [
            "Files > 20MB will use multipart upload",
            "200MB files will be split into ~25 parts of 8MB each",
            "Compression should reduce 200MB to ~70MB",
            "Total upload time should be under 2-3 minutes",
            "Check browser network tab for progress",
          ],
          troubleshooting: [
            "If timeout: Check client timeout settings",
            "If slow: Try direct upload method instead",
            "If compression fails: Original file will be uploaded",
            "If parts fail: Retry mechanism will attempt 5 times",
          ],
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Test endpoint to simulate upload progress
   * POST /api/video/test/progress
   */
  testProgress = async (req, res, next) => {
    try {
      const { fileSize } = req.body;

      if (!fileSize) {
        throw new BadRequestError("fileSize is required");
      }

      const fileSizeMB = fileSize / (1024 * 1024);
      const isLargeFile = fileSize > 20 * 1024 * 1024; // > 20MB

      let estimatedSteps = [];

      if (isLargeFile) {
        // Multipart upload simulation
        const partSize = 8 * 1024 * 1024; // 8MB
        const totalParts = Math.ceil(fileSize / partSize);
        const concurrentBatches = Math.ceil(totalParts / 20); // 20 concurrent

        estimatedSteps = [
          {
            stage: "validation",
            duration: "1s",
            description: "Validate video file",
          },
          {
            stage: "compression",
            duration: `${Math.ceil(fileSizeMB / 10)}s`,
            description: `Compress ${fileSizeMB.toFixed(1)}MB video`,
          },
          {
            stage: "multipart_init",
            duration: "2s",
            description: "Initialize multipart upload",
          },
          {
            stage: "upload_parts",
            duration: `${concurrentBatches * 3}s`,
            description: `Upload ${totalParts} parts in ${concurrentBatches} batches`,
          },
          {
            stage: "complete",
            duration: "2s",
            description: "Complete multipart upload",
          },
        ];
      } else {
        // Single upload simulation
        estimatedSteps = [
          {
            stage: "validation",
            duration: "1s",
            description: "Validate video file",
          },
          {
            stage: "compression",
            duration: `${Math.ceil(fileSizeMB / 10)}s`,
            description: `Compress ${fileSizeMB.toFixed(1)}MB video`,
          },
          {
            stage: "single_upload",
            duration: `${Math.ceil(fileSizeMB / 5)}s`,
            description: "Upload compressed video",
          },
        ];
      }

      const totalEstimatedTime = estimatedSteps.reduce((total, step) => {
        const timeMatch = step.duration.match(/(\d+)/);
        return total + (timeMatch ? parseInt(timeMatch[1]) : 0);
      }, 0);

      new SuccessResponse({
        message: "Upload progress estimation",
        metadata: {
          fileSize: fileSizeMB.toFixed(1) + "MB",
          uploadMethod: isLargeFile ? "multipart" : "single",
          estimatedSteps,
          totalEstimatedTime: totalEstimatedTime + "s",
          recommendations: [
            isLargeFile
              ? "Large file detected - multipart upload will be used"
              : "Small file - single upload will be used",
            fileSizeMB > 100
              ? "Consider using direct upload for better performance"
              : "Server upload is optimal for this file size",
            "Monitor browser network tab for real-time progress",
          ],
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new VideoTestController();
