"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import { createTopic, getAllTopc } from "../models/respositories/text.repo.js";
import SpeakingFactory from "../services/speaking.service.js";
import r2Service from "../services/r2.service.js";

class speakingController {
  create = async (req, res, next) => {
    console.log("data req:", req.body);
    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await SpeakingFactory.create(req.body),
    }).send(res);
  };
  createImage = async (req, res, next) => {
    try {
      const data = JSON.parse(req.body.data);

      console.log("data req:", req);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      // Upload files to R2
      const files = req.files.map((file) => ({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      }));

      const uploadResult = await r2Service.uploadMultipleFiles(
        files,
        "speaking"
      );

      if (!uploadResult.success) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadResult.error,
        });
      }

      // Add uploaded file URLs to data
      data.questions[0].image = uploadResult.data.successful.map((file) => ({
        url: file.url,
        key: file.key,
        originalName: file.originalName,
        size: file.size,
      }));

      new SuccessResponse({
        message: "Create new speaking with images success!",
        metadata: await SpeakingFactory.create(data),
      }).send(res);
    } catch (error) {
      console.error("Create Speaking with Image Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  getAllWithQuery = async (req, res, next) => {
    const params = req.query;

    const filter = JSON.parse(params.filter);

    const range = JSON.parse(params.range);

    const sort = JSON.parse(params.sort);

    new SuccessResponse({
      message: "creat new writing success!",
      metadata: await SpeakingFactory.getAllWithQuery({
        filter,
        range,
        sort,
      }),
      count: await SpeakingFactory.count(),
    }).send(res);
  };
  getOneById = async (req, res, next) => {
    const { id } = req.params;

    new SuccessResponse({
      message: "creat new writing success!",
      metadata: await SpeakingFactory.getOneById(id),
    }).send(res);
  };

  updateOneById = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    new SuccessResponse({
      message: "update new writing success!",
      metadata: await SpeakingFactory.updateSpeaking(id, data),
    }).send(res);
  };

  getAllWithFilters = async (req, res, next) => {
    console.log("data req:", req.body);

    new SuccessResponse({
      message: "creat new writing success!",
      metadata: await SpeakingFactory.getAllWithFilters(req.body),
    }).send(res);
  };
  // //QUERY//

  getAllTopic = async (req, res, next) => {
    // console.log('data req:', req.body);

    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await SpeakingFactory.getAllTopc(),
    }).send(res);
  };

  deleteById = async (req, res, next) => {
    console.log(" data req:", req.params);

    new SuccessResponse({
      message: "delete record success!",
      metadata: await SpeakingFactory.deleteSpeakingById({
        _id: req.params.id,
      }),
    }).send(res);
  };
  //END QUERY
}

export default new speakingController();
