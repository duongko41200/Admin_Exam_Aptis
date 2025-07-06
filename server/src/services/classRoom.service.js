"use strict";

import mongoose from "mongoose";
import ClassRoomModel from "../models/classRoom.model.js";
import baseRepo from "./base-repo/baseRepo.js";
import { redisGetAll,redisSetField } from "./base-repo/baseRedis.js";

const convertAssignmentsToRedisObject = (assignments) => {
  const redisData = {};

  assignments.forEach((item) => {
    if (!item.assignmentId || !item.assignmentId._id) return;

    const key = `assignment_${item.assignmentId._id}`;

    // Convert Mongoose Document thành plain object
    const assignmentPlain = item.assignmentId.toObject?.() || item.assignmentId;

    redisData[key] = {
      ...assignmentPlain,
      datePublic: item.datePublic || null, // merge thêm field ngoài
    };
  });

  return redisData;
};


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
    const res =  await baseRepo.findOneAndUpdate(
      { id: id, data: data,populate: "assignments.assignmentId" },
      ClassRoomModel
    );

    console.log("res:", res);
 if (res.isPublic === true) {
    const hash = `classRoom-${res.nameRoom}-${res._id}`;

    // Chuyển assignments thành object với key là assignment_<id>
    const redisData = convertAssignmentsToRedisObject(res.assignments);

    for (const [field, value] of Object.entries(redisData)) {
      await redisSetField({
        hash,    // ex: classRoom-103-66abc...
        field,   // ex: assignment_9
        value,   // full assignment object
      });
    }

    console.log(`Redis updated for hash: ${hash}`);
  }



    return res;
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
