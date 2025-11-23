"use strict";

import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "WritingSubmission";
const COLLECTION_NAME = "WritingSubmissions";

// Schema cho metadata của submission
const submissionMetadataSchema = new Schema(
  {
    taskId: { type: String },
    typeEmail: { type: Number }, // 1 for formal, 2 for informal
    sessionId: { type: String }, // for tracking user sessions
    deviceInfo: {
      userAgent: { type: String },
      platform: { type: String },
      screenResolution: { type: String },
    },
    timeSpent: { type: Number }, // in seconds
    retryCount: { type: Number, default: 0 },
    originalLanguage: { type: String, default: "vi" }, // source language
  },
  { _id: false }
);

// Main Writing Submission Schema
const writingSubmissionSchema = new Schema(
  {
    // User information
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Assignment/Task information
    assignmentWritingId: {
      type: Types.ObjectId,
      ref: "Writing",
      index: true,
    },

    // Writing details
    part: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
      index: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 5000, // Reasonable limit for writing tasks
    },

    // Type classification
    type: {
      type: String,
      enum: ["general", "academic", "email", "letter", "essay", "report"],
      default: "general",
      index: true,
    },

    // Language and proficiency
    targetLanguage: {
      type: String,
      default: "en",
      enum: ["en", "vi"],
    },

    expectedLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      index: true,
    },

    // Submission metadata
    metadata: submissionMetadataSchema,

    // Status tracking
    status: {
      type: String,
      enum: ["draft", "submitted", "processing", "completed", "failed"],
      default: "submitted",
      index: true,
    },

    // Processing information
    processingStartedAt: { type: Date },
    processingCompletedAt: { type: Date },

    // Analytics
    wordCount: { type: Number },
    sentenceCount: { type: Number },
    paragraphCount: { type: Number },

    // Submission timing
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // Version control
    version: { type: Number, default: 1 },

    // Related result (populated after processing)
    resultId: {
      type: String, // references WritingResult.writingId
      index: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Indexes for performance optimization
writingSubmissionSchema.index({ userId: 1, createdAt: -1 });
writingSubmissionSchema.index({ assignmentId: 1, userId: 1 });
writingSubmissionSchema.index({ status: 1, createdAt: -1 });
writingSubmissionSchema.index({ part: 1, type: 1 });
writingSubmissionSchema.index({ submittedAt: -1 });

// Compound index for common analytics queries
writingSubmissionSchema.index({
  userId: 1,
  part: 1,
  status: 1,
  createdAt: -1,
});

// Pre-save middleware to calculate analytics
writingSubmissionSchema.pre("save", function (next) {
  if (this.content) {
    // Calculate word count
    this.wordCount = this.content.trim().split(/\s+/).length;

    // Calculate sentence count (simple approximation)
    this.sentenceCount = this.content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;

    // Calculate paragraph count
    this.paragraphCount = this.content
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0).length;
  }
  next();
});

// Virtual populate for getting the result
writingSubmissionSchema.virtual("result", {
  ref: "WritingResult",
  localField: "writingId",
  foreignField: "writingId",
  justOne: true,
});

// Static method to get submissions by user with pagination
writingSubmissionSchema.statics.getByUserPaginated = function (
  userId,
  page = 1,
  limit = 20,
  filters = {}
) {
  const skip = (page - 1) * limit;

  const match = {
    userId: new Types.ObjectId(userId),
    isDeleted: false,
    ...filters,
  };

  return this.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "WritingResults",
              localField: "writingId",
              foreignField: "writingId",
              as: "result",
            },
          },
          {
            $unwind: {
              path: "$result",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $project: {
        data: 1,
        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
        totalPages: {
          $ceil: {
            $divide: [{ $arrayElemAt: ["$totalCount.count", 0] }, limit],
          },
        },
        currentPage: { $literal: page },
        hasNextPage: {
          $gt: [{ $arrayElemAt: ["$totalCount.count", 0] }, page * limit],
        },
      },
    },
  ]);
};

// Static method for analytics - submissions per day
writingSubmissionSchema.statics.getSubmissionStats = function (
  userId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        submittedAt: { $gte: startDate, $lte: endDate },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
          part: "$part",
        },
        count: { $sum: 1 },
        totalWords: { $sum: "$wordCount" },
        avgWords: { $avg: "$wordCount" },
      },
    },
    {
      $sort: { "_id.date": 1, "_id.part": 1 },
    },
  ]);
};

// Method to mark as processing
writingSubmissionSchema.methods.startProcessing = function () {
  this.status = "processing";
  this.processingStartedAt = new Date();
  return this.save();
};

// Method to mark as completed
writingSubmissionSchema.methods.completeProcessing = function (resultId) {
  this.status = "completed";
  this.processingCompletedAt = new Date();
  this.resultId = resultId;
  return this.save();
};

// Method to mark as failed
writingSubmissionSchema.methods.failProcessing = function (error) {
  this.status = "failed";
  this.processingCompletedAt = new Date();
  // Could add error field if needed
  return this.save();
};

export default model(DOCUMENT_NAME, writingSubmissionSchema);
