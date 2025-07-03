"use strict";

import SpeakingModel from "../models/speaking.model.js";
import baseRepo from "./base-repo/baseRepo.js";

class SpeakingFactory {
  static create = async (data) => {
    try {
      const Speaking = await SpeakingModel.create(data);
      return Speaking ? Speaking : null;
    } catch (error) {
      console.log("error: là: ", error);
      return error;
    }
  };

  static getAllWithQuery = async ({ filter, range, sort }) => {
    return await baseRepo.getAllWithQuery(
      { filter, range, sort },
      SpeakingModel
    );
  };

  static getOneById = async (id) => {
    return await baseRepo.getOneById({ id }, SpeakingModel);
  };

  static getAllWithFilters = async ({ partSkill }) => {
    return await baseRepo.getAllWithFiltersWritting(
      { partSkill },
      SpeakingModel
    );
  };

  static findById = async (id) => {
    return await SpeakingModel.findById(id).lean();
  };

  static updateSpeaking = async (id, data) => {
    return await SpeakingModel.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    );
  };

  static deleteSpeakingById = async (id) => {
    return await SpeakingModel.deleteOne({ _id: id }).lean();
  };

  static findAll = async () => {
    return await SpeakingModel.find().lean();
  };
}

export default SpeakingFactory;
