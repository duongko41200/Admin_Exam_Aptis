"use strict";

import baseRepo from "./base-repo/baseRepo.js";
import StudyProcessModel from "../models/stadyProcess.model.js";

class StudyProcessFactory {
  static create = async ({ processData, userId }) => {
    if (!processData || !Array.isArray(processData)) {
      throw new Error("Invalid process data");
    }

    return await baseRepo.createOrUpdate(
      {
        filter: { userId },
        update: {
          $set: { processData },
        },
      },
      StudyProcessModel
    );
  };
}

export default StudyProcessFactory;
