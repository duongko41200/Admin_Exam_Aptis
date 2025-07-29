"use strict";

import { SuccessResponse } from "../cores/success.response.js";
import StudyProcessFactory from "../services/studyProcess.service.js";

class StudyProcessController {
  create = async (req, res, next) => {
    const { processData } = req.body;

    new SuccessResponse({
      message: "update study process success!",
      metadata: await StudyProcessFactory.create({
        processData,
        userId: req.userIdGlobal,
      }),
    }).send(res);
  };
}

export default new StudyProcessController();
