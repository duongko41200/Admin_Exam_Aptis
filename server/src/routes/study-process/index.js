"use strict";
import express from "express";
import { authenticationV2 } from "../../auth/authUtils.js";
import { asyncHandle } from "../../auth/checkAuth.js";
import StudyProcessController from "../../controllers/studyProcess.controller.js";

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post("/", asyncHandle(StudyProcessController.create));

export default router;
