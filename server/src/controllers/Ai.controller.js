"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import {
  count,
  create,
  deleteById,
  getAllWithQuery,
  getOneById,
  updateOneById,
} from "../services/user.service.js";
import * as writingService from "../services/AI/writing.service.js";
import * as retrievalService from "../services/AI/retrieval.service.js";
import * as suggestionService from "../services/AI/suggestion.service.js";

class AiController {
  create = async (req, res, next) => {
    const body = req.body;

    console.log({ body: req.body });
    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await create(body),
    }).send(res);
  };

  // //QUERY//

  getAllWithQuery = async (req, res, next) => {
    const params = req.query;

    console.log({ params });
    const filter = JSON.parse(params.filter);

    const range = JSON.parse(params.range);

    const sort = JSON.parse(params.sort);

    new SuccessResponse({
      message: "get users success!",
      metadata: await getAllWithQuery({ filter, range, sort }),
      count: await count(),
    }).send(res);
  };

  getOneById = async (req, res, next) => {
    const params = req.params.id;

    new SuccessResponse({
      message: "user find success!",
      metadata: await getOneById(params),
    }).send(res);
  };

  deleteOneById = async (req, res, next) => {
    const { id } = req.params;

    new SuccessResponse({
      message: "delete user  success!",
      metadata: await deleteById(id),
    }).send(res);
  };
  updateOneById = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    console.log("data:", data);

    new SuccessResponse({
      message: "update new user success!",
      metadata: await updateOneById(id, data),
    }).send(res);
  };

  /**
   * Submit a new writing for scoring and analysis
   * Implements Flow A from API_FLOW_GUIDE.md
   */
  submitWriting = async (req, res, next) => {
    try {
      const { userId, prompt, type, content, metadata = {} } = req.body;

      const writingId = uuidv4();
      const submittedAt = new Date().toISOString();

      //Firt kiểm tra đúng format email

      const writingFormatValid = await writingService.validateAptisEmail(
        content
      );

      // console.log("validateAptisEmail:", writingFormatValid);

      // Step 1: Submit and store writing
      const writingResult = await writingService.submitWriting({
        writingId,
        userId,
        prompt,
        type,
        content,
        metadata,
        submittedAt,
      });

      // // Step 2: Find similar writings for RAG context
      const similarWritings = await retrievalService.findSimilarWritings(
        writingResult
      );

      console.log("similarWritings:", similarWritings);

      // // Step 3: Generate enhanced suggestions based on RAG
      const suggestions = await suggestionService.generateSuggestions(
        userId,
        type,
        writingResult,
        similarWritings
      );

      // console.log("similarWritings:", similarWritings);

      // // Step 4: Compile comprehensive response
      const response = {
        writingId: writingResult.id,
        score: writingResult.scores,
        detailedFeedback: writingResult.detailedFeedback,
        formatValid: writingFormatValid,

        ragInsights: {
          similarWritings: similarWritings,
          progressAnalysis: writingResult.progressAnalysis,
          formSuggestions: suggestions.formSuggestions,
          solutionReuse: suggestions.solutionReuse,
        },

        recommendations: suggestions.recommendations,
        processingTime: writingResult.processingTime,
      };

      // console.log("Submission response:", response);

      // logger.info("Writing submission completed", {
      //   writingId: writingResult.id,
      //   overallScore: writingResult.scores.overall,
      //   similarCount: similarWritings.length,
      // });

      res.status(201).json(response);
    } catch (error) {
      logger.error("Error in submitWriting", error);
      res.status(500).json({
        error: "Failed to process writing submission",
        message: error.message,
      });
    }
  };

  //END QUERY
}

export default new AiController();
