"use strict";

import { model, Schema, Types } from "mongoose";

const DOCUMENT_NAME = "UserProgress";
const COLLECTION_NAME = "UserProgresses";

// Schema cho detailed progress của từng skill part
const skillPartProgressSchema = new Schema(
  {
    part: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },

    // Current performance metrics
    currentLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      default: "A1",
    },

    // Score statistics
    averageScore: { type: Number, min: 0, max: 10, default: 0 },
    bestScore: { type: Number, min: 0, max: 10, default: 0 },
    recentScore: { type: Number, min: 0, max: 10, default: 0 },

    // Detailed criteria averages
    averageScores: {
      grammar: { type: Number, min: 0, max: 10, default: 0 },
      vocabulary: { type: Number, min: 0, max: 10, default: 0 },
      coherence: { type: Number, min: 0, max: 10, default: 0 },
      task_fulfillment: { type: Number, min: 0, max: 10, default: 0 },
    },

    // Progress tracking
    totalSubmissions: { type: Number, default: 0 },
    completedSubmissions: { type: Number, default: 0 },

    // Streak tracking
    currentStreak: { type: Number, default: 0 }, // consecutive days with submissions
    longestStreak: { type: Number, default: 0 },
    lastSubmissionDate: { type: Date },

    // Improvement metrics
    improvementRate: { type: Number, default: 0 }, // score improvement per submission
    consistencyScore: { type: Number, default: 0 }, // how consistent the scores are

    // Common issues tracking
    recurringIssues: [
      {
        issue: { type: String, required: true },
        frequency: { type: Number, default: 1 },
        lastOccurred: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
      },
    ],

    // Strengths
    strengths: [
      {
        strength: { type: String, required: true },
        confidence: { type: Number, min: 0, max: 1 }, // 0-1 confidence score
        firstIdentified: { type: Date, default: Date.now },
      },
    ],

    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Schema cho milestone achievements
const milestoneSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "FIRST_SUBMISSION",
        "SCORE_MILESTONE", // reached a certain score
        "CONSISTENCY_STREAK", // maintained consistent practice
        "IMPROVEMENT_RATE", // significant improvement
        "MASTERY_LEVEL", // reached B2, C1, etc.
        "PRACTICE_FREQUENCY", // daily practice for X days
      ],
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    // Milestone criteria
    threshold: { type: Schema.Types.Mixed }, // flexible for different milestone types

    achievedAt: { type: Date, default: Date.now },
    part: { type: Number }, // specific to a writing part, if applicable

    // Reward/badge info
    badgeIcon: { type: String },
    points: { type: Number, default: 0 },
  },
  { _id: true }
);

// Schema cho learning insights và recommendations
const learningInsightSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "WEAKNESS_PATTERN",
        "STRENGTH_DEVELOPMENT",
        "PRACTICE_SUGGESTION",
        "LEVEL_RECOMMENDATION",
        "FOCUS_AREA",
      ],
      required: true,
    },

    insight: { type: String, required: true },
    actionable: { type: Boolean, default: true },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    // Supporting data
    evidence: [
      {
        source: { type: String }, // which submissions/data support this insight
        confidence: { type: Number, min: 0, max: 1 },
      },
    ],

    // Recommendations
    recommendations: [{ type: String }],

    generatedAt: { type: Date, default: Date.now },
    validUntil: { type: Date }, // some insights may become outdated

    // User interaction
    acknowledged: { type: Boolean, default: false },
    helpful: { type: Boolean }, // user feedback on insight quality
  },
  { _id: true }
);

// Main User Progress Schema
const userProgressSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Overall progress metrics
    overallLevel: {
      type: String,
      enum: [
        "BEGINNER",
        "ELEMENTARY",
        "INTERMEDIATE",
        "UPPER_INTERMEDIATE",
        "ADVANCED",
      ],
      default: "BEGINNER",
    },

    totalPoints: { type: Number, default: 0 },

    // Progress by writing parts
    writingProgress: [skillPartProgressSchema],

    // Achievement system
    milestones: [milestoneSchema],

    // AI-generated learning insights
    insights: [learningInsightSchema],

    // Study patterns
    studyPatterns: {
      preferredTimeOfDay: [{ type: Number }], // hours of day (0-23)
      averageSessionDuration: { type: Number }, // minutes
      weeklyFrequency: { type: Number }, // sessions per week
      mostActiveDay: {
        type: String,
        enum: [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ],
      },
    },

    // Goal tracking
    goals: [
      {
        type: {
          type: String,
          enum: [
            "SCORE_TARGET",
            "FREQUENCY_TARGET",
            "LEVEL_TARGET",
            "CONSISTENCY_TARGET",
          ],
          required: true,
        },
        target: { type: Schema.Types.Mixed, required: true },
        deadline: { type: Date },
        achieved: { type: Boolean, default: false },
        progress: { type: Number, min: 0, max: 1, default: 0 }, // 0-1 completion percentage
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Performance trends (last 30 days)
    recentTrends: {
      scoreImprovement: { type: Number }, // positive = improving
      submissionFrequency: { type: Number }, // submissions per week
      consistencyRating: { type: Number, min: 0, max: 1 }, // how consistent recent performance is
    },

    // Personalization data
    preferences: {
      difficultyPreference: {
        type: String,
        enum: ["EASY", "MODERATE", "CHALLENGING"],
        default: "MODERATE",
      },
      feedbackDetail: {
        type: String,
        enum: ["BASIC", "DETAILED", "COMPREHENSIVE"],
        default: "DETAILED",
      },
      reminderFrequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "BIWEEKLY", "NEVER"],
        default: "WEEKLY",
      },
    },

    // Cache for expensive calculations
    calculatedAt: { type: Date, default: Date.now },
    needsRecalculation: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Indexes for performance
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ overallLevel: 1 });
userProgressSchema.index({ totalPoints: -1 });
userProgressSchema.index({ calculatedAt: 1 });
userProgressSchema.index({
  "writingProgress.part": 1,
  "writingProgress.averageScore": -1,
});

// Static method to initialize progress for new user
userProgressSchema.statics.initializeForUser = function (userId) {
  const initialProgress = {
    userId,
    writingProgress: [1, 2, 3, 4].map((part) => ({
      part,
      currentLevel: "A1",
      averageScore: 0,
      bestScore: 0,
      recentScore: 0,
      averageScores: {
        grammar: 0,
        vocabulary: 0,
        coherence: 0,
        task_fulfillment: 0,
      },
      totalSubmissions: 0,
      completedSubmissions: 0,
      currentStreak: 0,
      longestStreak: 0,
      improvementRate: 0,
      consistencyScore: 0,
      recurringIssues: [],
      strengths: [],
    })),
  };

  return this.create(initialProgress);
};

// Method to update progress after new submission
userProgressSchema.methods.updateAfterSubmission = function (writingResult) {
  const part = writingResult.part;
  const partProgress = this.writingProgress.find((p) => p.part === part);

  if (!partProgress) return;

  // Update submission counts
  partProgress.totalSubmissions += 1;
  if (writingResult.status === "completed") {
    partProgress.completedSubmissions += 1;
  }

  // Update scores
  const newScore = writingResult.score.overall;
  partProgress.recentScore = newScore;

  if (newScore > partProgress.bestScore) {
    partProgress.bestScore = newScore;
  }

  // Recalculate average score
  // This would need to query recent submissions for accurate calculation
  // For now, using simple weighted average
  const weight = 0.1; // weight for new score
  partProgress.averageScore =
    partProgress.averageScore * (1 - weight) + newScore * weight;

  // Update detailed scores
  partProgress.averageScores.grammar =
    partProgress.averageScores.grammar * (1 - weight) +
    writingResult.score.grammar * weight;
  partProgress.averageScores.vocabulary =
    partProgress.averageScores.vocabulary * (1 - weight) +
    writingResult.score.vocabulary * weight;
  partProgress.averageScores.coherence =
    partProgress.averageScores.coherence * (1 - weight) +
    writingResult.score.coherence * weight;
  partProgress.averageScores.task_fulfillment =
    partProgress.averageScores.task_fulfillment * (1 - weight) +
    writingResult.score.task_fulfillment * weight;

  // Update streak
  const today = new Date();
  const lastSubmission = partProgress.lastSubmissionDate;

  if (lastSubmission) {
    const daysDiff = Math.floor(
      (today - lastSubmission) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      // Consecutive day
      partProgress.currentStreak += 1;
      if (partProgress.currentStreak > partProgress.longestStreak) {
        partProgress.longestStreak = partProgress.currentStreak;
      }
    } else if (daysDiff > 1) {
      // Streak broken
      partProgress.currentStreak = 1;
    }
    // Same day submission doesn't change streak
  } else {
    partProgress.currentStreak = 1;
    partProgress.longestStreak = 1;
  }

  partProgress.lastSubmissionDate = today;
  partProgress.lastUpdated = today;

  // Mark for recalculation of complex metrics
  this.needsRecalculation = true;

  return this.save();
};

// Method to add milestone
userProgressSchema.methods.addMilestone = function (milestoneData) {
  this.milestones.push(milestoneData);

  // Add points if applicable
  if (milestoneData.points) {
    this.totalPoints += milestoneData.points;
  }

  return this.save();
};

// Method to add learning insight
userProgressSchema.methods.addInsight = function (insightData) {
  this.insights.push(insightData);

  // Keep only recent insights (last 50)
  if (this.insights.length > 50) {
    this.insights = this.insights.slice(-50);
  }

  return this.save();
};

// Static method to get leaderboard
userProgressSchema.statics.getLeaderboard = function (limit = 10, part = null) {
  const match = {};
  if (part) {
    match["writingProgress.part"] = part;
  }

  return this.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "Users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $sort: { totalPoints: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        userId: 1,
        userName: "$user.name",
        userAvatar: "$user.avatar",
        totalPoints: 1,
        overallLevel: 1,
        writingProgress: part
          ? {
              $filter: {
                input: "$writingProgress",
                cond: { $eq: ["$$this.part", part] },
              },
            }
          : "$writingProgress",
      },
    },
  ]);
};

export default model(DOCUMENT_NAME, userProgressSchema);
