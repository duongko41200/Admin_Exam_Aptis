"use strict";

import mongoose from "mongoose";
import AssignmentModel from "../models/assignment.model.js";
import baseRepo from "./base-repo/baseRepo.js";

class AssignmentFactory {
  static createTestBank = async (data) => {
    try {
      const reading = await AssignmentModel.create(data);
      return reading ? reading : null;
    } catch (error) {
      console.log("error: là: ", error);
      return error;
    }
  };
  static getOneById = async (id) => {
    return await baseRepo.getOneById({ id }, AssignmentModel);
  };

  static getAllWithQuery = async ({ filter, range, sort }) => {
    return await baseRepo.getAllWithQuery(
      { filter, range, sort },
      AssignmentModel
    );
  };
  static updateOneById = async (id, data) => {
    console.log("data tesst:", data);
    return await AssignmentModel.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    );
  };

  static getAllWithFilters = async ({ partSkill }) => {
    return await baseRepo.getAllWithFilters({ partSkill }, AssignmentModel);
  };
  static getAll = async () => {
    const res = await AssignmentModel.find().populate("lectures").exec();
    return res;
  };
  static getAllWithFiltersCourseType = async (filter) => {
    return await AssignmentModel.find({
      courseType: filter,
    }).lean();
  };

  static findById = async (id) => {
    return await AssignmentModel.findById(id).lean();
  };

  static updateTestBank = async (id, updateData) => {
    const options = { new: true };
    return await AssignmentModel.findByIdAndUpdate(id, updateData, options);
  };

  static deleteTestBankById = async (id) => {
    return await AssignmentModel.deleteOne({ _id: id }).lean();
  };

  static findAll = async () => {
    return await AssignmentModel.find().lean();
  };
}

export default AssignmentFactory;
