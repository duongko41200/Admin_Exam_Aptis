"use strict";
import express from "express";
import { authenticationV2 } from "../../auth/authUtils.js";
import { asyncHandle } from "../../auth/checkAuth.js";
import AiController from "../../controllers/Ai.controller.js";

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.get("/writing", asyncHandle(AiController.getAllWithQuery));

export default router;
