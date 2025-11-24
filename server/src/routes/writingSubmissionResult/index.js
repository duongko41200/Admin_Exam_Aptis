"use strict";

import express from "express";
import { authenticationV2 } from "../../auth/authUtils.js";
import { asyncHandle } from "../../auth/checkAuth.js";
import {
  writingResultController,
  writingSubmissionController,
} from "../../controllers/writingSubmissionResult.controller.js";
import { SuccessResponse } from "../../cores/success.response.js";
import { WritingSubmissionService } from "../../services/writingSubmissionResult.service.js";

const router = express.Router();

// Authentication middleware
router.use(authenticationV2);

/**
 * WritingSubmission Routes
 */

router.post(
  '/submissions-writing',
  asyncHandle(writingResultController.resultSubmissionAndWriting)
);

// Create new submission
router.post("/submissions", asyncHandle(writingSubmissionController.create));

// Get all submissions with query parameters (for admin dashboard)
router.get(
  "/submissions",
  asyncHandle(writingSubmissionController.getAllWithQuery)
);

// Get submission by writingId
router.get(
  "/submissions/writing/:writingId",
  asyncHandle(writingSubmissionController.getByWritingId)
);

// Get submission by ID
router.get(
  "/submissions/:id",
  asyncHandle(writingSubmissionController.getById)
);

// Get submissions by user
router.get(
  "/submissions/user/:userId",
  asyncHandle(writingSubmissionController.getByUser)
);

// Update submission by writingId
router.put(
  "/submissions/writing/:writingId",
  asyncHandle(writingSubmissionController.update)
);

// Delete submission by writingId
router.delete(
  "/submissions/writing/:writingId",
  asyncHandle(writingSubmissionController.delete)
);

// Processing workflow routes
router.post(
  "/submissions/writing/:writingId/start-processing",
  asyncHandle(writingSubmissionController.startProcessing)
);
router.post(
  "/submissions/writing/:writingId/complete-processing",
  asyncHandle(writingSubmissionController.completeProcessing)
);
router.post(
  "/submissions/writing/:writingId/fail-processing",
  asyncHandle(writingSubmissionController.failProcessing)
);

/**
 * WritingResult Routes
 */

// Create new result
router.post("/results", asyncHandle(writingResultController.create));

// Get all results with query parameters (for admin dashboard)
router.get("/results", asyncHandle(writingResultController.getAllWithQuery));

// Get result by writingId
router.get(
  "/results/writing/:writingId",
  asyncHandle(writingResultController.getByWritingId)
);

router.post(
  '/results/history',
  asyncHandle(writingResultController.getByWritingId)
);


// Get result by ID
router.get("/results/:id", asyncHandle(writingResultController.getById));

// Update result by writingId
router.put(
  "/results/writing/:writingId",
  asyncHandle(writingResultController.update)
);

// Delete result by writingId
router.delete(
  "/results/writing/:writingId",
  asyncHandle(writingResultController.delete)
);


// Analytics routes
router.get(
  "/results/user/:userId/performance",
  asyncHandle(writingResultController.getUserPerformance)
);
router.get(
  "/results/score-range",
  asyncHandle(writingResultController.getByScoreRange)
);

/**
 * Combined Routes (for workflow optimization)
 */

// Get submission with its result
router.get(
  "/workflow/writing/:writingId",
  asyncHandle(async (req, res, next) => {
    try {
      const { writingId } = req.params;

      // Get both submission and result in parallel
      const [submissionResult, resultResult] = await Promise.allSettled([
        writingSubmissionController.getByWritingId(req, res, next),
        writingResultController.getByWritingId(req, res, next),
      ]);

      const response = {
        submission:
          submissionResult.status === "fulfilled"
            ? submissionResult.value
            : null,
        result: resultResult.status === "fulfilled" ? resultResult.value : null,
        hasResult:
          resultResult.status === "fulfilled" && resultResult.value !== null,
      };

      new SuccessResponse({
        message: "Workflow data retrieved successfully",
        metadata: response,
      }).send(res);
    } catch (error) {
      next(error);
    }
  })
);

// Create submission and start processing workflow
router.post(
  "/workflow/submit-and-process",
  asyncHandle(async (req, res, next) => {
    try {
      const { submissionData } = req.body;

      // First create the submission
      const createResult = await WritingSubmissionService.createSubmission(
        submissionData
      );

      // Then start processing
      const processResult = await WritingSubmissionService.startProcessing(
        createResult.data.writingId
      );

      new SuccessResponse({
        message: "Submission created and processing started",
        metadata: {
          submission: createResult.data,
          processing: processResult.data,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
