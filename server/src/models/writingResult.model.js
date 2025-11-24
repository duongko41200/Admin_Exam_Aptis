'use strict';

import { model, Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'WritingResult';
const COLLECTION_NAME = 'WritingResults';

// Schema cho AI Score detail
const aiScoreSchema = new Schema(
  {
    score: { type: Number, required: true, min: 0, max: 20 },
    scoreWord: {
      type: String,
      required: true,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    review: { type: String, required: true },
    improve: { type: String, required: true },
    suggestions: [{ type: String }],
  },
  { _id: false }
);

// Schema cho detailed feedback của từng tiêu chí
const criteriaFeedbackSchema = new Schema(
  {
    score: { type: Number, required: true, min: 0, max: 10 },
    feedback: { type: String, required: true },
  },
  { _id: false }
);

// Schema cho grammar issues
const grammarIssueSchema = new Schema(
  {
    sentence: { type: String, required: true },
    error: { type: String, required: true },
    correction: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

// Schema cho vocabulary issues
const vocabularyIssueSchema = new Schema(
  {
    word: { type: String, required: true },
    issue: { type: String, required: true },
    suggestion: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

// Schema cho coherence issues
const coherenceIssueSchema = new Schema(
  {
    paragraph: { type: Number, required: true },
    issue: { type: String, required: true },
    explanation: { type: String, required: true },
    suggestion: { type: String, required: true },
  },
  { _id: false }
);

// Schema cho format issues
const formatIssueSchema = new Schema(
  {
    issue: { type: String, required: true },
    location: { type: String, required: true },
    suggestion: { type: String, required: true },
  },
  { _id: false }
);

// Schema cho comment detail
const commentDetailSchema = new Schema(
  {
    grammarIssues: [grammarIssueSchema],
    vocabularyIssues: [vocabularyIssueSchema],
    coherenceIssues: [coherenceIssueSchema],
    formatIssues: [formatIssueSchema],
  },
  { _id: false }
);

// Schema cho detailed feedback
const detailedFeedbackSchema = new Schema(
  {
    task_achievement: criteriaFeedbackSchema,
    coherence_cohesion: criteriaFeedbackSchema,
    lexical_resource: criteriaFeedbackSchema,
    grammatical_range_accuracy: criteriaFeedbackSchema,
    overall_comments: [{ type: String }],
    commentDetail: commentDetailSchema,
  },
  { _id: false }
);

// Schema cho format validation
const formatValidSchema = new Schema(
  {
    isValid: { type: Boolean, required: true, default: true },
    missingParts: [{ type: String }],
    suggestions: { type: Schema.Types.Mixed, default: {} },
    template: { type: String },
  },
  { _id: false }
);

// Schema cho similar writings trong RAG
const similarWritingDocumentSchema = new Schema(
  {
    pageContent: { type: String, required: true },
    metadata: {
      submittedAt: { type: Date, required: true },
      userId: { type: String, required: true },
      id: { type: String, required: true },
      taskId: { type: String },
      type: { type: String },
      template: { type: String },
      prompt: { type: String },
    },
  },
  { _id: false }
);

const similarWritingSchema = new Schema(
  {
    writingId: { type: String, required: true },
    similarity: { type: Number, required: true, min: 0, max: 1 },
    document: similarWritingDocumentSchema,
    level: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH (Possible duplicate)'],
    },
  },
  { _id: false }
);

// Schema cho progress analysis
const progressAnalysisSchema = new Schema(
  {
    improvement: { type: String, required: true },
    recurring_issues: [{ type: String }],
    strengths: [{ type: String }],
  },
  { _id: false }
);

// Schema cho form suggestions
const formSuggestionSchema = new Schema(
  {
    name: { type: String, required: true },
    template: { type: String, required: true },
    success_rate: { type: Number, required: true, min: 0, max: 10 },
    usage_context: { type: String, required: true },
  },
  { _id: false }
);

// Schema cho solution reuse
const solutionReuseSchema = new Schema(
  {
    solution: { type: String, required: true },
    template: { type: String, required: true },
    versatility_score: { type: Number, required: true, min: 1, max: 5 },
    questionReuse: [{ type: String }],
  },
  { _id: false }
);

// Schema cho RAG insights
const ragInsightsSchema = new Schema(
  {
    similarWritings: [similarWritingSchema],
    progressAnalysis: progressAnalysisSchema,
    formSuggestions: [formSuggestionSchema],
    solutionReuse: [solutionReuseSchema],
  },
  { _id: false }
);

// Schema cho metadata của submission
const submissionMetadataSchema = new Schema(
  {
    typeEmail: { type: Number }, // 1 for formal, 2 for informal
    deviceInfo: {
      userAgent: { type: String },
      platform: { type: String },
    },
  },
  { _id: false }
);

// Main Writing Result Schema
const writingResultSchema = new Schema(
  {
    // User information
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Assignment/Task information
    writingSubmissionId: {
      type: Types.ObjectId,
      ref: 'Writing',
      index: true,
    },
    taskId: { type: String, index: true },
    part: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000, // Reasonable limit for writing tasks
    },

    // Scoring results
    score: {
      grammar: { type: Number, required: true, min: 0, max: 10 },
      vocabulary: { type: Number, required: true, min: 0, max: 10 },
      coherence: { type: Number, required: true, min: 0, max: 10 },
      task_fulfillment: { type: Number, required: true, min: 0, max: 10 },
      overall: { type: Number, required: true, min: 0, max: 10 },
      Ai_Score: aiScoreSchema,
    },

    // Detailed feedback
    detailedFeedback: detailedFeedbackSchema,

    // Format validation
    formatValid: formatValidSchema,

    // RAG insights
    ragInsights: ragInsightsSchema,

    // Recommendations
    recommendations: [
      {
        recommendation: { type: String, required: true },
      },
    ],

    // Processing metadata
    processingTime: { type: Number }, // in seconds

    // Status and versioning
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'archived'],
      default: 'completed',
    },

    version: { type: Number, default: 1 },

    submittedAt: { type: Date, required: true },
    metadata: submissionMetadataSchema,

    // Soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    // Add indexes for performance
    index: [
      { userId: 1, createdAt: -1 },
      { writingId: 1 },
      { WritingSubmissionId: 1, userId: 1 },
      { 'score.overall': -1, createdAt: -1 },
      { part: 1, createdAt: -1 },
      { status: 1 },
    ],
  }
);

// Compound indexes for common queries
writingResultSchema.index({ userId: 1, part: 1, createdAt: -1 });
writingResultSchema.index({ WritingSubmissionId: 1, status: 1 });
writingResultSchema.index({ 'score.overall': -1, userId: 1 });

// Virtual for calculating improvement over time
writingResultSchema.virtual('scoreImprovement').get(function () {
  // This would be calculated by comparing with previous submissions
  return null;
});

// Pre-save middleware to calculate word count
writingResultSchema.pre('save', function (next) {
  if (this.content) {
    this.wordCount = this.content.split(/\s+/).length;
  }
  next();
});

// Static methods for analytics
writingResultSchema.statics.getAverageScoreByUser = function (
  userId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        createdAt: { $gte: startDate, $lte: endDate },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        avgGrammar: { $avg: '$score.grammar' },
        avgVocabulary: { $avg: '$score.vocabulary' },
        avgCoherence: { $avg: '$score.coherence' },
        avgTaskFulfillment: { $avg: '$score.task_fulfillment' },
        avgOverall: { $avg: '$score.overall' },
        totalSubmissions: { $sum: 1 },
      },
    },
  ]);
};

writingResultSchema.statics.getScoreTrend = function (userId, part = null) {
  const match = {
    userId: new Types.ObjectId(userId),
    isDeleted: false,
  };

  if (part) {
    match.part = part;
  }

  return this.aggregate([
    { $match: match },
    { $sort: { createdAt: 1 } },
    {
      $project: {
        createdAt: 1,
        overall: '$score.overall',
        grammar: '$score.grammar',
        vocabulary: '$score.vocabulary',
        coherence: '$score.coherence',
        task_fulfillment: '$score.task_fulfillment',
        part: 1,
      },
    },
  ]);
};

export default model(DOCUMENT_NAME, writingResultSchema);
