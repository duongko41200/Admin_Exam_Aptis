"use strict";

import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "AIAnalytics";
const COLLECTION_NAME = "AIAnalytics";

// Schema cho performance metrics của AI system
const performanceMetricSchema = new Schema(
  {
    metric: {
      type: String,
      required: true,
      enum: [
        "SCORING_ACCURACY",
        "PROCESSING_TIME",
        "ERROR_RATE",
        "USER_SATISFACTION",
        "FEEDBACK_QUALITY",
        "SIMILARITY_ACCURACY",
      ],
    },
    value: { type: Number, required: true },
    unit: { type: String }, // seconds, percentage, score, etc.
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Schema cho error tracking
const errorLogSchema = new Schema(
  {
    errorType: {
      type: String,
      required: true,
      enum: [
        "GEMINI_API_ERROR",
        "EMBEDDING_ERROR",
        "SCORING_ERROR",
        "CHROMA_DB_ERROR",
        "VALIDATION_ERROR",
        "TIMEOUT_ERROR",
      ],
    },
    errorMessage: { type: String, required: true },
    stack: { type: String },
    context: {
      userId: { type: String },
      writingId: { type: String },
      part: { type: Number },
      endpoint: { type: String },
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    resolution: { type: String },
  },
  { _id: true }
);

// Schema cho A/B testing results
const abTestResultSchema = new Schema(
  {
    testName: { type: String, required: true },
    variant: { type: String, required: true }, // A, B, C, etc.
    userId: { type: String, required: true },
    writingId: { type: String, required: true },

    // Metrics being tested
    metrics: {
      userSatisfaction: { type: Number, min: 1, max: 5 },
      processingTime: { type: Number },
      scoreAccuracy: { type: Number },
      feedbackQuality: { type: Number, min: 1, max: 5 },
    },

    // Additional context
    userFeedback: { type: String },
    testStarted: { type: Date, required: true },
    testCompleted: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Schema cho feature usage tracking
const featureUsageSchema = new Schema(
  {
    feature: {
      type: String,
      required: true,
      enum: [
        "AI_SCORING",
        "SIMILARITY_SEARCH",
        "DETAILED_FEEDBACK",
        "FORMAT_VALIDATION",
        "RAG_INSIGHTS",
        "PROGRESS_ANALYTICS",
        "RECOMMENDATION_ENGINE",
      ],
    },

    usageCount: { type: Number, default: 1 },
    uniqueUsers: { type: Number, default: 1 },

    // Performance data
    averageResponseTime: { type: Number },
    successRate: { type: Number, min: 0, max: 1 },

    // User engagement
    userRetentionRate: { type: Number, min: 0, max: 1 },
    featureSatisfaction: { type: Number, min: 1, max: 5 },

    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
  },
  { _id: false }
);

// Main AI Analytics Schema
const aiAnalyticsSchema = new Schema(
  {
    // Time period for this analytics record
    date: {
      type: Date,
      required: true,
      index: true,
    },

    period: {
      type: String,
      enum: ["HOURLY", "DAILY", "WEEKLY", "MONTHLY"],
      required: true,
      index: true,
    },

    // System performance metrics
    performanceMetrics: [performanceMetricSchema],

    // Error tracking
    errors: [errorLogSchema],

    // Usage statistics
    usage: {
      totalSubmissions: { type: Number, default: 0 },
      successfulProcessing: { type: Number, default: 0 },
      failedProcessing: { type: Number, default: 0 },
      uniqueUsers: { type: Number, default: 0 },

      // By writing part
      byPart: [
        {
          part: { type: Number, required: true },
          submissions: { type: Number, default: 0 },
          avgScore: { type: Number },
          avgProcessingTime: { type: Number },
        },
      ],

      // By user level
      byLevel: [
        {
          level: {
            type: String,
            enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
            required: true,
          },
          userCount: { type: Number, default: 0 },
          avgScore: { type: Number },
          improvementRate: { type: Number },
        },
      ],
    },

    // Quality metrics
    quality: {
      averageScoreAccuracy: { type: Number, min: 0, max: 1 },
      feedbackRelevanceScore: { type: Number, min: 0, max: 1 },
      userSatisfactionRate: { type: Number, min: 0, max: 1 },

      // AI model performance
      geminiApiUptime: { type: Number, min: 0, max: 1 },
      chromaDbUptime: { type: Number, min: 0, max: 1 },
      embeddingAccuracy: { type: Number, min: 0, max: 1 },
    },

    // Feature usage tracking
    featureUsage: [featureUsageSchema],

    // A/B test results
    abTests: [abTestResultSchema],

    // Cost tracking (if applicable)
    costs: {
      geminiApiCalls: { type: Number, default: 0 },
      embeddingCalls: { type: Number, default: 0 },
      chromaDbOperations: { type: Number, default: 0 },
      estimatedCost: { type: Number, default: 0 }, // in USD
    },

    // Trends and insights
    insights: [
      {
        type: {
          type: String,
          enum: [
            "PERFORMANCE_TREND",
            "USAGE_PATTERN",
            "QUALITY_INSIGHT",
            "COST_OPTIMIZATION",
            "USER_BEHAVIOR",
          ],
          required: true,
        },
        description: { type: String, required: true },
        impact: {
          type: String,
          enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"],
          required: true,
        },
        confidence: { type: Number, min: 0, max: 1 },
        actionRequired: { type: Boolean, default: false },
        priority: {
          type: String,
          enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
          default: "MEDIUM",
        },
      },
    ],

    // Cache flag for expensive calculations
    calculated: { type: Boolean, default: false },
    calculatedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Indexes for analytics queries
aiAnalyticsSchema.index({ date: -1, period: 1 });
aiAnalyticsSchema.index({ period: 1, "usage.totalSubmissions": -1 });
aiAnalyticsSchema.index({ "quality.userSatisfactionRate": -1 });
aiAnalyticsSchema.index({ calculatedAt: 1 });

// Static method to create daily analytics
aiAnalyticsSchema.statics.createDailyAnalytics = async function (date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // This would aggregate data from WritingSubmissions and WritingResults
  // Implementation depends on your specific analytics requirements

  const analyticsData = {
    date: startOfDay,
    period: "DAILY",
    // ... populate with actual data
  };

  return this.create(analyticsData);
};

// Static method to get performance trends
aiAnalyticsSchema.statics.getPerformanceTrends = function (
  startDate,
  endDate,
  period = "DAILY"
) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        period: period,
      },
    },
    {
      $sort: { date: 1 },
    },
    {
      $project: {
        date: 1,
        totalSubmissions: "$usage.totalSubmissions",
        successRate: {
          $cond: {
            if: { $gt: ["$usage.totalSubmissions", 0] },
            then: {
              $divide: [
                "$usage.successfulProcessing",
                "$usage.totalSubmissions",
              ],
            },
            else: 0,
          },
        },
        avgProcessingTime: "$performanceMetrics.processingTime",
        userSatisfaction: "$quality.userSatisfactionRate",
        errorRate: {
          $cond: {
            if: { $gt: ["$usage.totalSubmissions", 0] },
            then: {
              $divide: ["$usage.failedProcessing", "$usage.totalSubmissions"],
            },
            else: 0,
          },
        },
      },
    },
  ]);
};

// Static method to get cost analysis
aiAnalyticsSchema.statics.getCostAnalysis = function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalCost: { $sum: "$costs.estimatedCost" },
        totalGeminiCalls: { $sum: "$costs.geminiApiCalls" },
        totalEmbeddingCalls: { $sum: "$costs.embeddingCalls" },
        totalChromaOps: { $sum: "$costs.chromaDbOperations" },
        avgDailyCost: { $avg: "$costs.estimatedCost" },
        days: { $sum: 1 },
      },
    },
    {
      $project: {
        totalCost: 1,
        totalGeminiCalls: 1,
        totalEmbeddingCalls: 1,
        totalChromaOps: 1,
        avgDailyCost: 1,
        costPerSubmission: {
          $cond: {
            if: { $gt: ["$totalGeminiCalls", 0] },
            then: { $divide: ["$totalCost", "$totalGeminiCalls"] },
            else: 0,
          },
        },
      },
    },
  ]);
};

// Method to add error log
aiAnalyticsSchema.methods.addError = function (errorData) {
  this.errors.push({
    ...errorData,
    timestamp: new Date(),
  });

  return this.save();
};

// Method to add performance metric
aiAnalyticsSchema.methods.addPerformanceMetric = function (
  metric,
  value,
  unit
) {
  this.performanceMetrics.push({
    metric,
    value,
    unit,
    timestamp: new Date(),
  });

  return this.save();
};

// Method to record A/B test result
aiAnalyticsSchema.methods.recordAbTestResult = function (testData) {
  this.abTests.push(testData);
  return this.save();
};

export default model(DOCUMENT_NAME, aiAnalyticsSchema);
