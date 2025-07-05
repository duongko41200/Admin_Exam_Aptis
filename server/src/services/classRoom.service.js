"use strict";

import mongoose from "mongoose";
import ClassRoomModel from "../models/classRoom.model.js";
import baseRepo from "./base-repo/baseRepo.js";

class ClassRoomFactory {
  static createTestBank = async (data) => {
    try {
      const reading = await ClassRoomModel.create(data);
      return reading ? reading : null;
    } catch (error) {
      console.log("error: là: ", error);
      return error;
    }
  };
  static getOneById = async (id) => {
    // return await baseRepo.getOneByIdExtend(
    //   { id, populate: "assignments.assignmentId" },
    //   ClassRoomModel
    // );
    return await baseRepo.getOneById({ id }, ClassRoomModel);
  };

  static getAllWithQuery = async ({ filter, range, sort }) => {
    return await baseRepo.getAllWithQuery(
      { filter, range, sort },
      ClassRoomModel
    );
  };
  static updateOneById = async (id, data) => {
    console.log("data tesst:", data);
    return await baseRepo.findOneAndUpdate(
      { id: id, data: data },
      ClassRoomModel
    );
  };

  static getAllWithFilters = async ({ partSkill }) => {
    return await baseRepo.getAllWithFilters({ partSkill }, ClassRoomModel);
  };
  static getAll = async () => {
    const res = await ClassRoomModel.find().exec();
    return res;
  };
  static getAllWithFiltersCourseType = async (filter) => {
    return await ClassRoomModel.find({
      courseType: filter,
    }).lean();
  };

  static findById = async (id) => {
    return await ClassRoomModel.findById(id).lean();
  };

  static updateTestBank = async (id, updateData) => {
    const options = { new: true };
    return await ClassRoomModel.findByIdAndUpdate(id, updateData, options);
  };

  static deleteTestBankById = async (id) => {
    return await ClassRoomModel.deleteOne({ _id: id }).lean();
  };

  static findAll = async () => {
    return await ClassRoomModel.find().lean();
  };
}

export default ClassRoomFactory;
