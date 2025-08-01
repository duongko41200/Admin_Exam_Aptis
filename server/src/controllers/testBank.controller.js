"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import TestBankFactory from "../services/testBank.service.js";

class TestBankController {
  create = async (req, res, next) => {
    console.log("test data", req.body);

    new SuccessResponse({
      message: "creat new bo de success!",
      metadata: await TestBankFactory.createTestBank(req.body),
    }).send(res);
  };
  getOneById = async (req, res, next) => {
    const { id } = req.params;

    console.log("id:", id);

    new SuccessResponse({
      message: "creat new Reading success!",
      metadata: await TestBankFactory.getOneById(id),
    }).send(res);
  };

  getOneExtendById = async (req, res, next) => {
    const { id } = req.params;

    console.log("id:", id);

    new SuccessResponse({
      message: "creat new Reading success!",
      metadata: await TestBankFactory.getOneExtendById(id),
    }).send(res);
  };

  updateOneById = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    console.log("data::::", data);

    new SuccessResponse({
      message: "update new Reading success!",
      metadata: await TestBankFactory.updateOneById(id, data),
    }).send(res);
  };

  getAllWithQuery = async (req, res, next) => {
    const params = req.query;

    const filter = JSON.parse(params.filter);

    const range = JSON.parse(params.range);

    const sort = JSON.parse(params.sort);

    new SuccessResponse({
      message: "creat new BO DE success!",
      metadata: await TestBankFactory.getAllWithQuery({
        filter,
        range,
        sort,
      }),
    }).send(res);
  };

  getAllWithFilters = async (req, res, next) => {
    console.log("data req:", req.body);

    new SuccessResponse({
      message: "creat new Reading success!",
      metadata: await TestBankFactory.getAllWithFilters(req.body),
    }).send(res);
  };

  getAll = async (req, res, next) => {
    new SuccessResponse({
      message: "creat new Reading success!",
      metadata: await TestBankFactory.getAll(),
    }).send(res);
  };

  deleteById = async (req, res, next) => {
    console.log(" data req:", req.params);

    new SuccessResponse({
      message: "delete record success!",
      metadata: await TestBankFactory.deleteTestBankById({
        _id: req.params.id,
      }),
    }).send(res);
  };
  findQuery = async (req, res, next) => {
    new SuccessResponse({
      message: "creat new Reading success!",
      metadata: await TestBankFactory.findQuery(req.query),
    }).send(res);
  };
  // //QUERY//

  //END QUERY
}

export default new TestBankController();
