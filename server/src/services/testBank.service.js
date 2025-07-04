"use strict";

import mongoose from "mongoose";
import TestBankModel from "../models/testBank.model.js";
import baseRepo from "./base-repo/baseRepo.js";

class TestBankFactory {
  static createTestBank = async (data) => {
    try {
      const reading = await TestBankModel.create(data);
      return reading ? reading : null;
    } catch (error) {
      console.log("error: là: ", error);
      return error;
    }
  };
  static getOneById = async (id) => {
    return await baseRepo.getOneByIdExtend(
      {
        id,
        populate: [
          "speaking.part1",
          "speaking.part2",
          "speaking.part3",
          "speaking.part4",
          "listening.part1",
          "listening.part2",
          "listening.part3",
          "listening.part4",
          "reading.part1",
          "reading.part2",
          "reading.part3",
          "reading.part4",
          "reading.part5",
          "writing.part1",
          "writing.part2",
          "writing.part3",
          "writing.part4",
        //   "classRoomId",
        ],
      },
      TestBankModel
    );
  };

  static getAllWithQuery = async ({ filter, range, sort }) => {
    return await baseRepo.getAllWithQuery(
      { filter, range, sort, populate: ["classRoomId"] },
      TestBankModel
    );
  };
  static updateOneById = async (id, data) => {
    console.log("data tesst:", data);
    return await TestBankModel.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    );
  };

  static getAllWithFilters = async ({ partSkill }) => {
    return await baseRepo.getAllWithFilters({ partSkill }, TestBankModel);
  };
  static getAll = async () => {
    return await baseRepo.getAll(TestBankModel);
  };

  static findById = async (id) => {
    return await TestBankModel.findById(id).lean();
  };

  static updateTestBank = async (id, updateData) => {
    const options = { new: true };
    return await TestBankModel.findByIdAndUpdate(id, updateData, options);
  };

  static deleteTestBankById = async (id) => {
    return await TestBankModel.deleteOne({ _id: id }).lean();
  };

  static findAll = async () => {
    return await TestBankModel.find().lean();
  };
}

export default TestBankFactory;
