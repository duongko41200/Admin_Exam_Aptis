"use strict";

import ListeningModel from "../models/listening.model.js";
import baseRepo from "./base-repo/baseRepo.js";

class ListeningFactory {
  static create = async (data) => {
    try {
      const Listening = await ListeningModel.create(data);
      return Listening ? Listening : null;
    } catch (error) {
      console.log("error: là: ", error);
      return error;
    }
  };

  static getAllWithQuery = async ({ filter, range, sort }) => {
    return await baseRepo.getAllWithQuery(
      { filter, range, sort },
      ListeningModel
    );
  };

  static getOneById = async (id) => {
    return await baseRepo.getOneById({ id }, ListeningModel);
  };

  static getAllWithFilters = async ({ partSkill }) => {
    return await baseRepo.getAllWithFiltersWritting(
      { partSkill },
      ListeningModel
    );
  };

  static findById = async (id) => {
    return await ListeningModel.findById(id).lean();
  };

  static updateListening = async (id, data) => {
    return await ListeningModel.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    );
  };

  static deleteListeningById = async (id) => {
    return await ListeningModel.deleteOne({ _id: id }).lean();
  };

  static findAll = async () => {
    return await ListeningModel.find().lean();
  };
}

export default ListeningFactory;
