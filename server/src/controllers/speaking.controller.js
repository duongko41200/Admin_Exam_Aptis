"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import { createTopic, getAllTopc } from "../models/respositories/text.repo.js";
import SpeakingFactory from "../services/speaking.service.js";
import uploadImage from "../utils/uploadFile/cloudFlare-r2.js";

class speakingController {
  create = async (req, res, next) => {
    console.log("data req:", req.body);
    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await SpeakingFactory.create(req.body),
    }).send(res);
  };
  createImage = async (req, res, next) => {
    const data = JSON.parse(req.body.data);
    data.questions[0].image = req.files;

    // const upload_image_cloudflare = await uploadImage(req.file);

    // console.log('upload_image_cloudflare:', upload_image_cloudflare);

    if (!req.files) {
      return res.status(400).send("No file uploaded");
    }

    new SuccessResponse({
      message: "creat new textFrom success!",
      metadata: await SpeakingFactory.create(data),
    }).send(res);
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
    }).send(res);
  };
  getOneById = async (req, res, next) => {
    const { id } = req.params;

    console.log("id:", id);

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
      metadata: await SpeakingFactory.updatewriting(id, data),
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
