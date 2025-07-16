"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import { createTopic, getAllTopc } from "../models/respositories/text.repo.js";
import redisDataFactory from "../services/redisData.service.js";

class RedisDataController {
  create = async (req, res, next) => {
    // console.log('data req:', req.body);
    const { hash, field, value } = req.body;

    if (!hash || !field || value === undefined) {
      return res.status(400).json({
        error: "Missing hash, field, or value",
      });
    }

    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await redisDataFactory.create({ hash, field, value }),
    }).send(res);
  };

  getAll = async (req, res, next) => {
    const hash = req.query.hash;
    const field = req.query.field;

    if (!hash) {
      return res.status(400).json({ error: "Missing hash" });
    }

    new SuccessResponse({
      message: "creat new Reading success!",
      metadata: await redisDataFactory.getAllWithQuery({ hash, field }),
    }).send(res);
  };
  delete = async (req, res, next) => {
    const hash = req.query.hash;
    const field = req.query.field;

    if (!hash || !field) {
      return res.status(400).json({ error: "Missing hash or field" });
    }

    new SuccessResponse({
      message: "creat new Reading success!",
      metadata: await redisDataFactory.delete({ hash, field }),
    }).send(res);
  };

  updateOneById = async (req, res, next) => {
    const { hash, field, value } = req.body;

    if (!hash || !field || value === undefined) {
      return res.status(400).json({
        error: "Missing hash, field, or value",
      });
    }

    new SuccessResponse({
      message: "update new Reading success!",
      metadata: await redisDataFactory.update({ hash, field, value }),
    }).send(res);
  };
}

export default new RedisDataController();
