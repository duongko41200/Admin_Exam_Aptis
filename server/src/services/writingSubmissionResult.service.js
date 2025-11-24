'use strict';

import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestError,
  ConflcRequestError,
  NotFoundError,
} from '../cores/Error.response.js';
import {
  WritingResultRepository,
  WritingSubmissionRepository,
} from '../models/respositories/writingSubmissionResult.repo.js';

/**
 * Service for WritingSubmission operations
 */
export class WritingSubmissionService {
  /**
   * Create new writing submission
   * @param {Object} submissionData - Submission data
   * @returns {Promise<Object>} Created submission
   */
  static async createSubmission(submissionData) {
    try {
      // Validate required fields
      if (
        !submissionData.userId ||
        !submissionData.content ||
        !submissionData.part
      ) {
        throw new BadRequestError(
          'Missing required fields: userId, content, part'
        );
      }

      // Generate unique writingId if not provided
      if (!submissionData.writingId) {
        submissionData.writingId = uuidv4();
      }

      // Check if writingId already exists
      const existingSubmission =
        await WritingSubmissionRepository.findByWritingId(
          submissionData.writingId
        );
      if (existingSubmission) {
        throw new ConflcRequestError(
          `Submission with writingId ${submissionData.writingId} already exists`
        );
      }

      console.log('submissionData service:', submissionData);

      // Set default values
      const submissionPayload = {
        ...submissionData,
        status: submissionData.status || 'submitted',
        submittedAt: submissionData.submittedAt || new Date(),
        targetLanguage: submissionData.targetLanguage || 'en',
        type: submissionData.type || 'general',
      };

      const newSubmission = await WritingSubmissionRepository.create(
        submissionPayload
      );

      return {
        success: true,
        data: newSubmission,
        message: 'Writing submission created successfully',
      };
    } catch (error) {
      console.error('Error creating writing submission:', error);
      throw error;
    }
  }

  /**
   * Get submission by writingId
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object>} Submission data
   */
  static async getSubmissionByWritingId(writingId) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    const submission = await WritingSubmissionRepository.findByWritingId(
      writingId
    );
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    return {
      success: true,
      data: submission,
      message: 'Submission retrieved successfully',
    };
  }

  /**
   * Get submission by ID
   * @param {string} id - Submission ID
   * @returns {Promise<Object>} Submission data
   */
  static async getSubmissionById(id) {
    if (!id) {
      throw new BadRequestError('ID is required');
    }

    const submission = await WritingSubmissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    return {
      success: true,
      data: submission,
      message: 'Submission retrieved successfully',
    };
  }

  /**
   * Update submission
   * @param {string} writingId - Writing ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated submission
   */
  static async updateSubmission(writingId, updateData) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    // Check if submission exists
    const existingSubmission =
      await WritingSubmissionRepository.findByWritingId(writingId);
    if (!existingSubmission) {
      throw new NotFoundError('Submission not found');
    }

    // Remove fields that shouldn't be updated
    const {
      writingId: _,
      userId: __,
      createdAt: ___,
      ...allowedUpdates
    } = updateData;

    const updatedSubmission =
      await WritingSubmissionRepository.updateByWritingId(
        writingId,
        allowedUpdates
      );

    return {
      success: true,
      data: updatedSubmission,
      message: 'Submission updated successfully',
    };
  }

  /**
   * Delete submission (soft delete)
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteSubmission(writingId) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    // Check if submission exists
    const existingSubmission =
      await WritingSubmissionRepository.findByWritingId(writingId);
    if (!existingSubmission) {
      throw new NotFoundError('Submission not found');
    }

    await WritingSubmissionRepository.softDelete(writingId);

    return {
      success: true,
      message: 'Submission deleted successfully',
    };
  }

  /**
   * Get all submissions with query parameters
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Paginated submissions
   */
  static async getAllSubmissions(queryParams) {
    try {
      const result = await WritingSubmissionRepository.getAllWithQuery(
        queryParams
      );

      return {
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNext: result.currentPage < result.totalPages,
          hasPrev: result.currentPage > 1,
        },
        message: 'Submissions retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting all submissions:', error);
      throw error;
    }
  }

  /**
   * Get submissions by user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} User submissions
   */
  static async getSubmissionsByUser(userId, options = {}) {
    if (!userId) {
      throw new BadRequestError('UserId is required');
    }

    const { page = 1, limit = 20, ...filters } = options;
    const result = await WritingSubmissionRepository.getByUserPaginated(
      userId,
      page,
      limit,
      filters
    );

    return {
      success: true,
      data: result.data || [],
      pagination: {
        total: result.totalCount || 0,
        totalPages: result.totalPages || 0,
        currentPage: result.currentPage || 1,
        hasNext: result.hasNextPage || false,
      },
      message: 'User submissions retrieved successfully',
    };
  }

  /**
   * Start processing submission
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object>} Updated submission
   */
  static async startProcessing(writingId) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    const updateData = {
      status: 'processing',
      processingStartedAt: new Date(),
    };

    return await this.updateSubmission(writingId, updateData);
  }

  /**
   * Complete processing submission
   * @param {string} writingId - Writing ID
   * @param {string} resultId - Result ID
   * @returns {Promise<Object>} Updated submission
   */
  static async completeProcessing(writingId, resultId) {
    if (!writingId || !resultId) {
      throw new BadRequestError('WritingId and resultId are required');
    }

    const updateData = {
      status: 'completed',
      processingCompletedAt: new Date(),
      resultId,
    };

    return await this.updateSubmission(writingId, updateData);
  }

  /**
   * Fail processing submission
   * @param {string} writingId - Writing ID
   * @param {string} errorMessage - Error message
   * @returns {Promise<Object>} Updated submission
   */
  static async failProcessing(writingId, errorMessage) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    const updateData = {
      status: 'failed',
      processingCompletedAt: new Date(),
      errorMessage: errorMessage || 'Processing failed',
    };

    return await this.updateSubmission(writingId, updateData);
  }
}

/**
 * Service for WritingResult operations
 */
export class WritingResultService {
  /**
   * Create new writing result
   * @param {Object} resultData - Result data
   * @returns {Promise<Object>} Created result
   */
  static async createResult(resultData) {
    try {
      // Set default values
      const resultPayload = {
        ...resultData,
        status: resultData.status || 'completed',
        submittedAt: resultData.submittedAt || new Date(),
      };


      console.log('resultData service:', resultData);

      const newResult = await WritingResultRepository.create(resultPayload);

      return newResult; 
    } catch (error) {
      console.error('Error creating writing result:', error);
      throw error;
    }
  }

  static async getByResultHistory(userId, writingSubmissionId) {
    if (!writingSubmissionId) {
      throw new BadRequestError('WritingSubmissionId is required');
    }

    const result = await WritingResultRepository.findByHistory(
      userId,
      writingSubmissionId
    );
    if (!result) {
      throw new NotFoundError('Result not found');
    }

    return result;
  }

  /**
   * Get result by writingId
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object>} Result data
   */
  static async getResultByWritingId(writingId) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    const result = await WritingResultRepository.findByWritingId(writingId);
    if (!result) {
      throw new NotFoundError('Result not found');
    }

    return {
      success: true,
      data: result,
      message: 'Result retrieved successfully',
    };
  }

  /**
   * Get result by ID
   * @param {string} id - Result ID
   * @returns {Promise<Object>} Result data
   */
  static async getResultById(id) {
    if (!id) {
      throw new BadRequestError('ID is required');
    }

    const result = await WritingResultRepository.findById(id);
    if (!result) {
      throw new NotFoundError('Result not found');
    }

    return {
      success: true,
      data: result,
      message: 'Result retrieved successfully',
    };
  }

  /**
   * Update result
   * @param {string} writingId - Writing ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated result
   */
  static async updateResult(writingId, updateData) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    // Check if result exists
    const existingResult = await WritingResultRepository.findByWritingId(
      writingId
    );
    if (!existingResult) {
      throw new NotFoundError('Result not found');
    }

    // Validate score structure if updating scores
    if (updateData.score) {
      this.validateScoreStructure(updateData.score);
    }

    // Remove fields that shouldn't be updated
    const {
      writingId: _,
      userId: __,
      createdAt: ___,
      ...allowedUpdates
    } = updateData;

    const updatedResult = await WritingResultRepository.updateByWritingId(
      writingId,
      allowedUpdates
    );

    return {
      success: true,
      data: updatedResult,
      message: 'Result updated successfully',
    };
  }

  /**
   * Delete result (soft delete)
   * @param {string} writingId - Writing ID
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteResult(writingId) {
    if (!writingId) {
      throw new BadRequestError('WritingId is required');
    }

    // Check if result exists
    const existingResult = await WritingResultRepository.findByWritingId(
      writingId
    );
    if (!existingResult) {
      throw new NotFoundError('Result not found');
    }

    await WritingResultRepository.softDelete(writingId);

    return {
      success: true,
      message: 'Result deleted successfully',
    };
  }

  /**
   * Get all results with query parameters
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Paginated results
   */
  static async getAllResults(queryParams) {
    try {
      const result = await WritingResultRepository.getAllWithQuery(queryParams);

      return {
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNext: result.currentPage < result.totalPages,
          hasPrev: result.currentPage > 1,
        },
        message: 'Results retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting all results:', error);
      throw error;
    }
  }

  /**
   * Get user performance analytics
   * @param {string} userId - User ID
   * @param {Object} options - Analytics options
   * @returns {Promise<Object>} Performance analytics
   */
  static async getUserPerformance(userId, options = {}) {
    if (!userId) {
      throw new BadRequestError('UserId is required');
    }

    const { startDate, endDate, part } = options;

    const [averageScores, scoreTrend] = await Promise.all([
      startDate && endDate
        ? WritingResultRepository.getAverageScoreByUser(
            userId,
            startDate,
            endDate
          )
        : Promise.resolve([]),
      WritingResultRepository.getScoreTrend(userId, part),
    ]);

    return {
      success: true,
      data: {
        averageScores: averageScores[0] || null,
        scoreTrend,
        userId,
      },
      message: 'User performance retrieved successfully',
    };
  }

  /**
   * Get results by score range
   * @param {number} minScore - Minimum score
   * @param {number} maxScore - Maximum score
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Results in score range
   */
  static async getResultsByScoreRange(minScore, maxScore, filters = {}) {
    if (minScore === undefined || maxScore === undefined) {
      throw new BadRequestError('Both minScore and maxScore are required');
    }

    if (minScore < 0 || maxScore > 10 || minScore > maxScore) {
      throw new BadRequestError(
        'Invalid score range. Scores must be between 0-10 and minScore <= maxScore'
      );
    }

    const results = await WritingResultRepository.getByScoreRange(
      minScore,
      maxScore,
      filters
    );

    return {
      success: true,
      data: results,
      message: `Results with scores between ${minScore} and ${maxScore} retrieved successfully`,
    };
  }

  /**
   * Validate score structure
   * @private
   * @param {Object} score - Score object to validate
   */
  static validateScoreStructure(score) {
    const requiredFields = [
      'grammar',
      'vocabulary',
      'coherence',
      'task_fulfillment',
      'overall',
    ];
    const missingFields = requiredFields.filter(
      (field) => score[field] === undefined
    );

    if (missingFields.length > 0) {
      throw new BadRequestError(
        `Missing score fields: ${missingFields.join(', ')}`
      );
    }

    // Validate score ranges
    requiredFields.forEach((field) => {
      const value = score[field];
      if (typeof value !== 'number' || value < 0 || value > 10) {
        throw new BadRequestError(
          `Invalid score for ${field}. Must be a number between 0 and 10`
        );
      }
    });

    // Validate AI_Score if present
    if (score.Ai_Score) {
      if (
        !score.Ai_Score.scoreWord ||
        !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(score.Ai_Score.scoreWord)
      ) {
        throw new BadRequestError(
          'Invalid AI_Score.scoreWord. Must be one of: A1, A2, B1, B2, C1, C2'
        );
      }

      if (
        typeof score.Ai_Score.score !== 'number' ||
        score.Ai_Score.score < 0 ||
        score.Ai_Score.score > 20
      ) {
        throw new BadRequestError(
          'Invalid AI_Score.score. Must be a number between 0 and 20'
        );
      }
    }
  }

  static async resultSubmissionAndWriting(data, result) {
    const submission = await WritingSubmissionService.createSubmission(data);

    if (!submission) {
      throw new Error('Error processing submission');
    }

    const resultClone = { ...result };

    resultClone['writingSubmissionId'] = submission.data._id;

    const resultRes = await WritingResultService.createResult(resultClone);

    if (!resultRes) {
      throw new Error('Error processing result');
    }

    return resultRes;
  }
}
