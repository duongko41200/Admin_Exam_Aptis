'use strict';

import { SuccessResponse } from '../cores/success.response.js';
import {
  WritingResultService,
  WritingSubmissionService,
} from '../services/writingSubmissionResult.service.js';

/**
 * Controller for WritingSubmission operations
 */
class WritingSubmissionController {
  /**
   * Create new writing submission
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  create = async (req, res, next) => {
    try {
      const result = await WritingSubmissionService.createSubmission(req.body);

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get submission by writingId
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getByWritingId = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const result = await WritingSubmissionService.getSubmissionByWritingId(
        writingId
      );

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get submission by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await WritingSubmissionService.getSubmissionById(id);

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update submission
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  update = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const result = await WritingSubmissionService.updateSubmission(
        writingId,
        req.body
      );

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete submission
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  delete = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const result = await WritingSubmissionService.deleteSubmission(writingId);

      new SuccessResponse({
        message: result.message,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all submissions with query parameters
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getAllWithQuery = async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query;

      const queryParams = {
        filter: filter ? JSON.parse(filter) : {},
        range: range ? JSON.parse(range) : [0, 10],
        sort: sort ? JSON.parse(sort) : ['createdAt', 'DESC'],
      };

      const result = await WritingSubmissionService.getAllSubmissions(
        queryParams
      );

      new SuccessResponse({
        message: result.message,
        metadata: {
          data: result.data,
          pagination: result.pagination,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get submissions by user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getByUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { page, limit, ...filters } = req.query;

      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
        ...filters,
      };

      const result = await WritingSubmissionService.getSubmissionsByUser(
        userId,
        options
      );

      new SuccessResponse({
        message: result.message,
        metadata: {
          data: result.data,
          pagination: result.pagination,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Start processing submission
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  startProcessing = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const result = await WritingSubmissionService.startProcessing(writingId);

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Complete processing submission
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  completeProcessing = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const { resultId } = req.body;
      const result = await WritingSubmissionService.completeProcessing(
        writingId,
        resultId
      );

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Fail processing submission
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  failProcessing = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const { errorMessage } = req.body;
      const result = await WritingSubmissionService.failProcessing(
        writingId,
        errorMessage
      );

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Controller for WritingResult operations
 */
class WritingResultController {
  /**
   * Create new writing result
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  create = async (req, res, next) => {
    try {
      const result = await WritingResultService.createResult(req.body);

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get result by writingId
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getByWritingId = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const result = await WritingResultService.getResultByWritingId(writingId);

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get result by writingId
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getByResultHistory = async (req, res, next) => {
    try {
      const { userId, writingSubmissionId } = req.body;
      const result = await WritingResultService.getByResultHistory(userId, writingSubmissionId);


      console.log('getByResultHistory::::', result);

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get result by ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await WritingResultService.getResultById(id);

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update result
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  update = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const result = await WritingResultService.updateResult(
        writingId,
        req.body
      );

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete result
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  delete = async (req, res, next) => {
    try {
      const { writingId } = req.params;
      const result = await WritingResultService.deleteResult(writingId);

      new SuccessResponse({
        message: result.message,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all results with query parameters
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getAllWithQuery = async (req, res, next) => {
    try {
      const { filter, range, sort } = req.query;

      const queryParams = {
        filter: filter ? JSON.parse(filter) : {},
        range: range ? JSON.parse(range) : [0, 10],
        sort: sort ? JSON.parse(sort) : ['createdAt', 'DESC'],
      };

      const result = await WritingResultService.getAllResults(queryParams);

      new SuccessResponse({
        message: result.message,
        metadata: {
          data: result.data,
          pagination: result.pagination,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user performance analytics
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getUserPerformance = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate, part } = req.query;

      const options = {};
      if (startDate) options.startDate = new Date(startDate);
      if (endDate) options.endDate = new Date(endDate);
      if (part) options.part = parseInt(part);

      const result = await WritingResultService.getUserPerformance(
        userId,
        options
      );

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get results by score range
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware
   */
  getByScoreRange = async (req, res, next) => {
    try {
      const { minScore, maxScore } = req.query;
      const { userId, part, ...otherFilters } = req.query;

      const filters = {};
      if (userId) filters.userId = userId;
      if (part) filters.part = parseInt(part);
      Object.assign(filters, otherFilters);

      const result = await WritingResultService.getResultsByScoreRange(
        parseFloat(minScore),
        parseFloat(maxScore),
        filters
      );

      new SuccessResponse({
        message: result.message,
        metadata: result.data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  resultSubmissionAndWriting = async (req, res, next) => {
    const { submission, result } = req.body;
    const response = await WritingResultService.resultSubmissionAndWriting(
      submission,
      result
    );

    new SuccessResponse({
      message: 'successfully processed submission and result',
      metadata: response,
    }).send(res);
  };
}

export const writingSubmissionController = new WritingSubmissionController();
export const writingResultController = new WritingResultController();
