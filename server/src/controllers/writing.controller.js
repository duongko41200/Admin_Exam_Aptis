"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import { createTopic, getAllTopc } from "../models/respositories/text.repo.js";
import WritingFactory from "../services/writing.service.js";

class WritingController {
  create = async (req, res, next) => {
    console.log("data req writing:", req.body);

    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await WritingFactory.createWriting(req.body),
    }).send(res);
  };

  getAllWithQuery = async (req, res, next) => {
    const params = req.query;

    const filter = JSON.parse(params.filter);

    const range = JSON.parse(params.range);

    const sort = JSON.parse(params.sort);

    new SuccessResponse({
      message: "creat new writing success!",
      metadata: await WritingFactory.getAllWithQuery({
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
      metadata: await WritingFactory.getOneById(id),
    }).send(res);
  };

  updateOneById = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    new SuccessResponse({
      message: "update new writing success!",
      metadata: await WritingFactory.updateWriting(id, data),
    }).send(res);
  };

  getAllWithFilters = async (req, res, next) => {
    console.log("data req:", req.body);

    new SuccessResponse({
      message: "creat new writing success!",
      metadata: await WritingFactory.getAllWithFilters(req.body),
    }).send(res);
  };
  // //QUERY//

  getAllTopic = async (req, res, next) => {
    // console.log('data req:', req.body);

    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await WritingFactory.getAllTopc(),
    }).send(res);
  };
  deleteById = async (req, res, next) => {
    console.log(" data req:", req.params);

    new SuccessResponse({
      message: "delete record success!",
      metadata: await WritingFactory.deleteById({
        _id: req.params.id,
      }),
    }).send(res);
  };
  //END QUERY
}

export default new WritingController();
