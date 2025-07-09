"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import { createTopic, getAllTopc } from "../models/respositories/text.repo.js";
import {
  getAllWithQuery,
  getOneById,
  create,
  deleteById,
  updateOneById,
} from "../services/user.service.js";

class UserController {
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
      message: "creat new textFrom success!",
      metadata: await getAllWithQuery({ filter, range, sort }),
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

  //END QUERY
}

export default new UserController();
