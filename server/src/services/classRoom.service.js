"use strict";

import ClassRoomModel from "../models/classRoom.model.js";
import { redisDeleteField, redisGetAll, redisSetField } from "./base-repo/baseRedis.js";
import baseRepo from "./base-repo/baseRepo.js";

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

  // Lấy danh sách tất cả field hiện có trong Redis
  const currentFields = Object.keys(await redisGetAll({ hash }));

  // Tạo danh sách các field sẽ giữ lại dựa trên assignments hiện tại
  const updatedAssignments = convertAssignmentsToRedisObject(res.assignments);
  const updatedFields = Object.keys(updatedAssignments);

  // Xóa các field cũ không còn trong assignments
  for (const field of currentFields) {
    if (field.startsWith("assignment_") && !updatedFields.includes(field)) {
      await redisDeleteField({ hash, field });
    }
  }

  // Cập nhật lại các assignment hiện tại
  for (const [field, value] of Object.entries(updatedAssignments)) {
    await redisSetField({ hash, field, value });
  }
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
