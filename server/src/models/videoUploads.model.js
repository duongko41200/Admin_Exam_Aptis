import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "VideoUpload";
const COLLECTION_NAME = "VideoUploads";

const videoUploadSchema = new Schema(
  {
    // Upload identification
    uploadId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // File information
    fileName: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    key: {
      type: String,
      required: true,
      unique: true,
    },

    contentType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    // Upload status
    status: {
      type: String,
      enum: ["initializing", "uploading", "completed", "aborted", "failed"],
      default: "initializing",
      index: true,
    },

    // Part information
    totalParts: {
      type: Number,
      required: true,
    },

    partSize: {
      type: Number,
      required: true,
    },

    completedParts: [
      {
        partNumber: {
          type: Number,
          required: true,
        },
        etag: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // User information
    userId: {
      type: String, // Changed from ObjectId to String to support encrypted user IDs
      index: true,
    },

    userEmail: {
      type: String,
      index: true,
    },

    // Final upload result
    publicUrl: {
      type: String,
    },

    location: {
      type: String,
    },

    bucket: {
      type: String,
      default: "aptis-files",
    },

    // Metadata
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // Timestamps
    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expireAfterSeconds: 0 },
    },

    // Progress tracking
    uploadProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Error information
    error: {
      message: String,
      code: String,
      details: Schema.Types.Mixed,
    },

    // Upload performance metrics
    metrics: {
      startTime: Date,
      endTime: Date,
      duration: Number, // in milliseconds
      averageSpeed: Number, // bytes per second
      retryCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Indexes for performance
videoUploadSchema.index({ uploadId: 1, status: 1 });
videoUploadSchema.index({ userId: 1, status: 1 });
videoUploadSchema.index({ status: 1, createdAt: -1 });
videoUploadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
videoUploadSchema.methods.updateProgress = function () {
  if (this.totalParts > 0) {
    this.uploadProgress = Math.round(
      (this.completedParts.length / this.totalParts) * 100
    );
  }
  return this.uploadProgress;
};

videoUploadSchema.methods.addCompletedPart = function (
  partNumber,
  etag,
  size = null
) {
  // Check if part already exists
  const existingPart = this.completedParts.find(
    (part) => part.partNumber === partNumber
  );

  if (!existingPart) {
    this.completedParts.push({
      partNumber,
      etag,
      size,
      completedAt: new Date(),
    });

    // Sort parts by partNumber
    this.completedParts.sort((a, b) => a.partNumber - b.partNumber);

    // Update progress
    this.updateProgress();
  }

  return this;
};

videoUploadSchema.methods.markCompleted = function (publicUrl, location) {
  this.status = "completed";
  this.publicUrl = publicUrl;
  this.location = location;
  this.completedAt = new Date();
  this.uploadProgress = 100;

  // Calculate metrics
  if (this.metrics.startTime) {
    this.metrics.endTime = new Date();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;

    if (this.metrics.duration > 0) {
      this.metrics.averageSpeed =
        this.fileSize / (this.metrics.duration / 1000);
    }
  }

  return this;
};

videoUploadSchema.methods.markFailed = function (error) {
  this.status = "failed";
  this.error = {
    message: error.message || "Unknown error",
    code: error.code || "UNKNOWN_ERROR",
    details: error.details || {},
  };

  return this;
};

videoUploadSchema.methods.markAborted = function () {
  this.status = "aborted";
  return this;
};

// Static methods
videoUploadSchema.statics.findByUploadId = function (uploadId) {
  return this.findOne({ uploadId });
};

videoUploadSchema.statics.findActiveUploads = function (userId = null) {
  const query = {
    status: { $in: ["initializing", "uploading"] },
  };

  if (userId) {
    query.userId = userId;
  }

  return this.find(query).sort({ createdAt: -1 });
};

videoUploadSchema.statics.findCompletedUploads = function (
  userId = null,
  limit = 10
) {
  const query = { status: "completed" };

  if (userId) {
    query.userId = userId;
  }

  return this.find(query).sort({ completedAt: -1 }).limit(limit);
};

videoUploadSchema.statics.cleanupExpiredUploads = function () {
  return this.deleteMany({
    status: { $in: ["aborted", "failed"] },
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
};

export default model(DOCUMENT_NAME, videoUploadSchema);
