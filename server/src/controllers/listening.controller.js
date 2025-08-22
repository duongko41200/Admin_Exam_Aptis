"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import { createTopic, getAllTopc } from "../models/respositories/text.repo.js";
import ListeningFactory from "../services/listening.service.js";
import r2Service from "../services/r2.service.js";

class listeningController {
  create = async (req, res, next) => {
    console.log("data req:", req.body);
    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await ListeningFactory.create(req.body),
    }).send(res);
  };
  createImage = async (req, res, next) => {
    try {
      const data = JSON.parse(req.body.data);

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
        "listening"
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
        message: "Create new listening with images success!",
        metadata: await ListeningFactory.create(data),
      }).send(res);
    } catch (error) {
      console.error("Create Listening with Image Error:", error);
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
      metadata: await ListeningFactory.getAllWithQuery({
        filter,
        range,
        sort,
      }),
    }).send(res);
  };
  getOneById = async (req, res, next) => {
    const { id } = req.params;

    console.log("id:", id);

    new SuccessResponse({
      message: "creat new writing success!",
      metadata: await ListeningFactory.getOneById(id),
    }).send(res);
  };

  updateOneById = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    new SuccessResponse({
      message: "update new writing success!",
      metadata: await ListeningFactory.updateListening(id, data),
    }).send(res);
  };

  getAllWithFilters = async (req, res, next) => {
    console.log("data req:", req.body);

    new SuccessResponse({
      message: "creat new writing success!",
      metadata: await ListeningFactory.getAllWithFilters(req.body),
    }).send(res);
  };
  // //QUERY//

  getAllTopic = async (req, res, next) => {
    // console.log('data req:', req.body);

    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await ListeningFactory.getAllTopc(),
    }).send(res);
  };

  deleteById = async (req, res, next) => {
    console.log(" data req:", req.params);

    new SuccessResponse({
      message: "delete record success!",
      metadata: await ListeningFactory.deleteListeningById({
        _id: req.params.id,
      }),
    }).send(res);
  };
  //END QUERY
}

export default new listeningController();
