"use strict";

import { safetyCount } from "../../helpers/safetyCount.js";
import WritingResultModel from "../writingResult.model.js";
import WritingSubmissionModel from "../writingSubmission.model.js";

/**
 * Repository for WritingSubmission operations
 */
export class WritingSubmissionRepository {
  /**
   * Create new writing submission
   * @param {Object} data - Submission data
   * @returns {Promise<Object>} Created submission
   */
  static async create(data) {
    return await WritingSubmissionModel.create(data);
  }

  /**
   * Find submission by writingId
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object|null>} Submission or null
   */
  static async findByWritingId(writingId) {
    return await WritingSubmissionModel.findOne({ writingId, isDeleted: false })
      .populate("userId", "name email")
      .populate("assignmentId")
      .lean();
  }

  /**
   * Find submission by ID
   * @param {string} id - Submission ID
   * @returns {Promise<Object|null>} Submission or null
   */
  static async findById(id) {
    return await WritingSubmissionModel.findById(id)
      .populate("userId", "name email")
      .populate("assignmentId")
      .lean();
  }

  /**
   * Update submission
   * @param {string} writingId - Writing ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} Updated submission
   */
  static async updateByWritingId(writingId, data) {
    return await WritingSubmissionModel.findOneAndUpdate(
      { writingId, isDeleted: false },
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();
  }

  /**
   * Soft delete submission
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object|null>} Deleted submission
   */
  static async softDelete(writingId) {
    return await WritingSubmissionModel.findOneAndUpdate(
      { writingId, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();
  }

  /**
   * Get submissions with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated submissions
   */
  static async getAllWithQuery({
    filter = {},
    range = [0, 10],
    sort = ["createdAt", "DESC"],
  }) {
    const limit = range[1] - range[0] + 1;
    const page = Math.floor(range[0] / limit) + 1;

    const query = {
      ...filter,
      isDeleted: false,
    };

    const sortOrder = sort[1] === "ASC" ? 1 : -1;
    const sortObj = { [sort[0]]: sortOrder };

    const countPromise = safetyCount({ model: WritingSubmissionModel, query });
    const dataPromise = WritingSubmissionModel.find(query)
      .populate("userId", "name email")
      .populate("assignmentId")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const [count, data] = await Promise.all([countPromise, dataPromise]);

    return {
      data,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Get submissions by user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} User submissions
   */
  static async getByUserPaginated(userId, page = 1, limit = 20, filters = {}) {
    return await WritingSubmissionModel.getByUserPaginated(
      userId,
      page,
      limit,
      filters
    );
  }

  /**
   * Get submission statistics
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Submission stats
   */
  static async getSubmissionStats(userId, startDate, endDate) {
    return await WritingSubmissionModel.getSubmissionStats(
      userId,
      startDate,
      endDate
    );
  }

  /**
   * Find submissions by multiple criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Matching submissions
   */
  static async findByCriteria(criteria) {
    const query = { ...criteria, isDeleted: false };
    return await WritingSubmissionModel.find(query)
      .populate("userId", "name email")
      .populate("assignmentId")
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Count submissions by status
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Status counts
   */
  static async getStatusCounts(filters = {}) {
    const query = { ...filters, isDeleted: false };

    return await WritingSubmissionModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  }
}

/**
 * Repository for WritingResult operations
 */
export class WritingResultRepository {
  /**
   * Create new writing result
   * @param {Object} data - Result data
   * @returns {Promise<Object>} Created result
   */
  static async create(data) {
    return await WritingResultModel.create(data);
  }

  /**
   * Find result by writingId
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object|null>} Result or null
   */
  static async findByWritingId(writingId) {
    return await WritingResultModel.findOne({ writingId, isDeleted: false })
      .populate("userId", "name email")
      .populate("assignmentWritingId")
      .lean();
  }

  /**
   * Find result by ID
   * @param {string} id - Result ID
   * @returns {Promise<Object|null>} Result or null
   */
  static async findById(id) {
    return await WritingResultModel.findById(id)
      .populate("userId", "name email")
      .populate("assignmentWritingId")
      .lean();
  }

  /**
   * Update result
   * @param {string} writingId - Writing ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} Updated result
   */
  static async updateByWritingId(writingId, data) {
    return await WritingResultModel.findOneAndUpdate(
      { writingId, isDeleted: false },
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();
  }

  /**
   * Soft delete result
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object|null>} Deleted result
   */
  static async softDelete(writingId) {
    return await WritingResultModel.findOneAndUpdate(
      { writingId, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();
  }

  /**
   * Get results with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated results
   */
  static async getAllWithQuery({
    filter = {},
    range = [0, 10],
    sort = ["createdAt", "DESC"],
  }) {
    const limit = range[1] - range[0] + 1;
    const page = Math.floor(range[0] / limit) + 1;

    const query = {
      ...filter,
      isDeleted: false,
    };

    const sortOrder = sort[1] === "ASC" ? 1 : -1;
    const sortObj = { [sort[0]]: sortOrder };

    const countPromise = safetyCount({ model: WritingResultModel, query });
    const dataPromise = WritingResultModel.find(query)
      .populate("userId", "name email")
      .populate("assignmentWritingId")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const [count, data] = await Promise.all([countPromise, dataPromise]);

    return {
      data,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Get average score by user
   * @param {string} userId - User ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Average scores
   */
  static async getAverageScoreByUser(userId, startDate, endDate) {
    return await WritingResultModel.getAverageScoreByUser(
      userId,
      startDate,
      endDate
    );
  }

  /**
   * Get score trend for user
   * @param {string} userId - User ID
   * @param {number} part - Writing part (optional)
   * @returns {Promise<Array>} Score trend
   */
  static async getScoreTrend(userId, part = null) {
    return await WritingResultModel.getScoreTrend(userId, part);
  }

  /**
   * Find results by multiple criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Matching results
   */
  static async findByCriteria(criteria) {
    const query = { ...criteria, isDeleted: false };
    return await WritingResultModel.find(query)
      .populate("userId", "name email")
      .populate("assignmentWritingId")
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Get results by score range
   * @param {number} minScore - Minimum score
   * @param {number} maxScore - Maximum score
   * @param {Object} additionalFilters - Additional filters
   * @returns {Promise<Array>} Results in score range
   */
  static async getByScoreRange(minScore, maxScore, additionalFilters = {}) {
    const query = {
      ...additionalFilters,
      "score.overall": { $gte: minScore, $lte: maxScore },
      isDeleted: false,
    };

    return await WritingResultModel.find(query)
      .populate("userId", "name email")
      .populate("assignmentWritingId")
      .sort({ "score.overall": -1 })
      .lean();
  }

  /**
   * Get performance statistics
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Performance stats
   */
  static async getPerformanceStats(filters = {}) {
    const query = { ...filters, isDeleted: false };

    return await WritingResultModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgOverallScore: { $avg: "$score.overall" },
          avgGrammar: { $avg: "$score.grammar" },
          avgVocabulary: { $avg: "$score.vocabulary" },
          avgCoherence: { $avg: "$score.coherence" },
          avgTaskFulfillment: { $avg: "$score.task_fulfillment" },
          maxScore: { $max: "$score.overall" },
          minScore: { $min: "$score.overall" },
          totalResults: { $sum: 1 },
        },
      },
    ]);
  }
}
