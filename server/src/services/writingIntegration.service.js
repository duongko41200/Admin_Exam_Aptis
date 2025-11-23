/**
 * WritingService Integration with New Database Models
 *
 * This service integrates the existing AI writing service with the new scalable database design.
 * It provides methods to handle writing submissions and results using the new model structure.
 */

import { v4 as uuidv4 } from "uuid";
import AIAnalytics from "../models/aiAnalytics.model.js";
import UserProgress from "../models/userProgress.model.js";
import WritingResult from "../models/writingResult.model.js";
import WritingSubmission from "../models/writingSubmission.model.js";

// Import existing AI services
import * as retrievalService from "../services/AI/retrieval.service.js";
import * as suggestionService from "../services/AI/suggestion.service.js";
import * as writingService from "../services/AI/writing.service.js";

/**
 * Submit a new writing for processing with the new database structure
 * This replaces the existing submitWriting workflow
 */
export const submitWritingWithNewDB = async (submissionData) => {
  const startTime = Date.now();
  const writingId = uuidv4();

  try {
    // Step 1: Create initial submission record
    const submission = await WritingSubmission.create({
      writingId,
      userId: submissionData.userId,
      assignmentId: submissionData.assignmentId,
      part: submissionData.part,
      prompt: submissionData.prompt,
      content: submissionData.content,
      type: submissionData.type || "general",
      targetLanguage: submissionData.targetLanguage || "en",
      expectedLevel: submissionData.expectedLevel,
      metadata: submissionData.metadata,
      submittedAt: new Date(),
    });

    // Step 2: Mark as processing
    await submission.startProcessing();

    // Step 3: Process with existing AI service
    const aiResult = await writingService.submitWriting({
      writingId,
      userId: submissionData.userId,
      part: submissionData.part,
      prompt: submissionData.prompt,
      content: submissionData.content,
      metadata: submissionData.metadata,
      submittedAt: submission.submittedAt.toISOString(),
      type: submissionData.type || "writing",
    });

    // Step 4: Get RAG insights
    const ragInsights = await generateEnhancedRAGInsights(aiResult, submission);

    // Step 5: Create result record with complete stampResult structure
    const result = await WritingResult.create({
      writingId,
      userId: submissionData.userId,
      assignmentId: submissionData.assignmentId,
      taskId: submissionData.metadata?.taskId,
      part: submissionData.part,
      content: submissionData.content,
      prompt: submissionData.prompt,

      score: aiResult.scores,
      detailedFeedback: aiResult.detailedFeedback,
      formatValid: aiResult.formatValid || {
        isValid: true,
        missingParts: [],
        suggestions: {},
        template: "",
      },
      ragInsights: ragInsights,
      recommendations: aiResult.recommendations || [],
      processingTime: (Date.now() - startTime) / 1000,
      wordCount: submission.wordCount,
      submittedAt: submission.submittedAt,
    });

    // Step 6: Mark submission as completed
    await submission.completeProcessing(writingId);

    // Step 7: Update user progress
    await updateUserProgressAfterSubmission(submissionData.userId, result);

    // Step 8: Record analytics
    await recordAnalytics(result, aiResult);

    // Step 9: Return complete result in stampResult format
    return formatStampResult(result);
  } catch (error) {
    console.error("Error in submitWritingWithNewDB:", error);

    // Mark submission as failed if it exists
    try {
      const submission = await WritingSubmission.findOne({ writingId });
      if (submission) {
        await submission.failProcessing(error.message);
      }
    } catch (updateError) {
      console.error("Failed to update submission status:", updateError);
    }

    throw error;
  }
};

/**
 * Generate enhanced RAG insights using existing services
 */
async function generateEnhancedRAGInsights(aiResult, submission) {
  try {
    // Get similar writings using existing retrieval service
    const similarWritings = await retrievalService.findSimilarWritings({
      id: submission.writingId,
      userId: submission.userId.toString(),
      content: submission.content,
      type: submission.type,
      embedding: aiResult.embedding,
    });

    // Generate form suggestions using existing suggestion service
    const suggestions = await suggestionService.generateSuggestions(
      submission.userId.toString(),
      submission.type,
      aiResult,
      similarWritings
    );

    // Structure RAG insights according to stampResult format
    return {
      similarWritings: similarWritings.map((writing) => ({
        writingId: writing.writingId || writing.id,
        similarity: writing.similarity,
        document: writing.document,
        level: categorizeimilarityLevel(writing.similarity),
      })),

      progressAnalysis: {
        improvement:
          aiResult.progressAnalysis?.improvement ||
          "First writing submission - baseline established",
        recurring_issues: aiResult.progressAnalysis?.recurring_issues || [],
        strengths: aiResult.progressAnalysis?.strengths || [
          "Getting started with writing practice",
        ],
      },

      formSuggestions: suggestions.formSuggestions || [],
      solutionReuse: suggestions.solutionReuse || [],
    };
  } catch (error) {
    console.warn("Failed to generate enhanced RAG insights:", error);
    return {
      similarWritings: [],
      progressAnalysis: {
        improvement: "Analysis unavailable",
        recurring_issues: [],
        strengths: [],
      },
      formSuggestions: [],
      solutionReuse: [],
    };
  }
}

/**
 * Update user progress after successful submission
 */
async function updateUserProgressAfterSubmission(userId, result) {
  try {
    // Get or create user progress
    let userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      userProgress = await UserProgress.initializeForUser(userId);
    }

    // Update progress with new result
    await userProgress.updateAfterSubmission(result);

    // Check for milestones
    await checkAndAwardMilestones(userProgress, result);

    // Generate learning insights
    await generateLearningInsights(userProgress, result);
  } catch (error) {
    console.warn("Failed to update user progress:", error);
    // Don't throw error to avoid breaking the main flow
  }
}

/**
 * Check and award milestones based on new submission
 */
async function checkAndAwardMilestones(userProgress, result) {
  const milestones = [];

  // First submission milestone
  if (
    userProgress.writingProgress.find((p) => p.part === result.part)
      ?.totalSubmissions === 1
  ) {
    milestones.push({
      type: "FIRST_SUBMISSION",
      title: `First Writing Part ${result.part}`,
      description: `Completed your first Writing Part ${result.part} submission!`,
      threshold: { part: result.part, submissions: 1 },
      part: result.part,
      badgeIcon: "🎯",
      points: 10,
    });
  }

  // Score milestone (reaching B2 level)
  if (result.score.overall >= 7 && result.score.Ai_Score?.scoreWord === "B2") {
    milestones.push({
      type: "MASTERY_LEVEL",
      title: "B2 Level Achievement",
      description: "Congratulations! You've reached B2 proficiency level.",
      threshold: { level: "B2", score: 7 },
      part: result.part,
      badgeIcon: "🏆",
      points: 50,
    });
  }

  // Award milestones
  for (const milestone of milestones) {
    await userProgress.addMilestone(milestone);
  }
}

/**
 * Generate learning insights based on performance
 */
async function generateLearningInsights(userProgress, result) {
  const insights = [];

  // Grammar weakness pattern
  if (result.score.grammar < 6) {
    insights.push({
      type: "WEAKNESS_PATTERN",
      insight: "Grammar needs improvement based on recent submissions",
      priority: "HIGH",
      recommendations: [
        "Focus on subject-verb agreement",
        "Practice complex sentence structures",
        "Review common grammar rules",
      ],
      evidence: [
        {
          source: result.writingId,
          confidence: 0.8,
        },
      ],
    });
  }

  // Vocabulary strength
  if (result.score.vocabulary >= 8) {
    insights.push({
      type: "STRENGTH_DEVELOPMENT",
      insight: "Excellent vocabulary usage demonstrated consistently",
      priority: "MEDIUM",
      recommendations: [
        "Continue using diverse vocabulary",
        "Explore more advanced expressions",
        "Help other learners with vocabulary tips",
      ],
      evidence: [
        {
          source: result.writingId,
          confidence: 0.9,
        },
      ],
    });
  }

  // Add insights to user progress
  for (const insight of insights) {
    await userProgress.addInsight(insight);
  }
}

/**
 * Record analytics for the submission
 */
async function recordAnalytics(result, aiResult) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create daily analytics record
    let analytics = await AIAnalytics.findOne({
      date: today,
      period: "DAILY",
    });

    if (!analytics) {
      analytics = await AIAnalytics.create({
        date: today,
        period: "DAILY",
        usage: {
          totalSubmissions: 0,
          successfulProcessing: 0,
          failedProcessing: 0,
          uniqueUsers: 0,
          byPart: [],
          byLevel: [],
        },
        performanceMetrics: [],
        quality: {},
      });
    }

    // Update usage metrics
    analytics.usage.totalSubmissions += 1;
    analytics.usage.successfulProcessing += 1;

    // Update part-specific metrics
    const partMetric = analytics.usage.byPart.find(
      (p) => p.part === result.part
    );
    if (partMetric) {
      partMetric.submissions += 1;
      partMetric.avgScore = (partMetric.avgScore + result.score.overall) / 2;
    } else {
      analytics.usage.byPart.push({
        part: result.part,
        submissions: 1,
        avgScore: result.score.overall,
        avgProcessingTime: result.processingTime,
      });
    }

    // Add performance metric
    analytics.performanceMetrics.push({
      metric: "PROCESSING_TIME",
      value: result.processingTime,
      unit: "seconds",
      timestamp: new Date(),
    });

    await analytics.save();
  } catch (error) {
    console.warn("Failed to record analytics:", error);
  }
}

/**
 * Format result to match stampResult structure
 */
function formatStampResult(result) {
  return {
    writingId: result.writingId,
    score: result.score,
    detailedFeedback: result.detailedFeedback,
    formatValid: result.formatValid,
    ragInsights: result.ragInsights,
    recommendations: result.recommendations,
    processingTime: result.processingTime,
  };
}

/**
 * Categorize similarity level based on similarity score
 */
function categorizeimilarityLevel(similarity) {
  if (similarity >= 0.9) return "VERY HIGH (Possible duplicate)";
  if (similarity >= 0.7) return "HIGH";
  if (similarity >= 0.5) return "MEDIUM";
  return "LOW";
}

/**
 * Get user writing history with progress analysis
 */
export const getUserWritingHistory = async (userId, options = {}) => {
  const {
    page = 1,
    limit = 20,
    part = null,
    startDate = null,
    endDate = null,
  } = options;

  try {
    // Build filters
    const filters = {};
    if (part) filters.part = part;
    if (startDate || endDate) {
      filters.submittedAt = {};
      if (startDate) filters.submittedAt.$gte = new Date(startDate);
      if (endDate) filters.submittedAt.$lte = new Date(endDate);
    }

    // Get submissions with results
    const history = await WritingSubmission.getByUserPaginated(
      userId,
      page,
      limit,
      filters
    );

    // Get user progress
    const userProgress = await UserProgress.findOne({ userId });

    return {
      ...history.data[0],
      userProgress: userProgress
        ? {
            overallLevel: userProgress.overallLevel,
            totalPoints: userProgress.totalPoints,
            writingProgress: userProgress.writingProgress,
            recentMilestones: userProgress.milestones.slice(-5),
            activeInsights: userProgress.insights
              .filter((i) => !i.acknowledged)
              .slice(-3),
          }
        : null,
    };
  } catch (error) {
    console.error("Error getting user writing history:", error);
    throw error;
  }
};

/**
 * Get analytics dashboard data
 */
export const getAnalyticsDashboard = async (startDate, endDate) => {
  try {
    const [performanceTrends, costAnalysis, systemHealth] = await Promise.all([
      AIAnalytics.getPerformanceTrends(startDate, endDate),
      AIAnalytics.getCostAnalysis(startDate, endDate),
      getSystemHealthMetrics(),
    ]);

    return {
      performanceTrends,
      costAnalysis: costAnalysis[0] || {},
      systemHealth,
      summary: {
        totalUsers: await UserProgress.countDocuments(),
        totalSubmissions: await WritingSubmission.countDocuments({
          submittedAt: { $gte: startDate, $lte: endDate },
        }),
        averageScore: await getAverageScore(startDate, endDate),
        topPerformers: await getTopPerformers(10),
      },
    };
  } catch (error) {
    console.error("Error getting analytics dashboard:", error);
    throw error;
  }
};

/**
 * Helper function to get system health metrics
 */
async function getSystemHealthMetrics() {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [totalSubmissions, failedSubmissions, avgProcessingTime] =
    await Promise.all([
      WritingSubmission.countDocuments({
        submittedAt: { $gte: last24Hours },
      }),
      WritingSubmission.countDocuments({
        submittedAt: { $gte: last24Hours },
        status: "failed",
      }),
      WritingResult.aggregate([
        {
          $match: {
            createdAt: { $gte: last24Hours },
          },
        },
        {
          $group: {
            _id: null,
            avgProcessingTime: { $avg: "$processingTime" },
          },
        },
      ]),
    ]);

  return {
    successRate:
      totalSubmissions > 0
        ? (totalSubmissions - failedSubmissions) / totalSubmissions
        : 1,
    avgProcessingTime: avgProcessingTime[0]?.avgProcessingTime || 0,
    totalSubmissions24h: totalSubmissions,
    errorRate: totalSubmissions > 0 ? failedSubmissions / totalSubmissions : 0,
  };
}

/**
 * Helper function to get average score
 */
async function getAverageScore(startDate, endDate) {
  const result = await WritingResult.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$score.overall" },
      },
    },
  ]);

  return result[0]?.avgScore || 0;
}

/**
 * Helper function to get top performers
 */
async function getTopPerformers(limit = 10) {
  return UserProgress.getLeaderboard(limit);
}

export default {
  submitWritingWithNewDB,
  getUserWritingHistory,
  getAnalyticsDashboard,
};
