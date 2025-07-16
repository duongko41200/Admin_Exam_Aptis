"use strict";
import express from "express";
import { authenticationV2 } from "../../auth/authUtils.js";
import { asyncHandle } from "../../auth/checkAuth.js";
import RedisDataController from "../../controllers/redisData.controller.js";

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post("/", asyncHandle(RedisDataController.create));
router.get("/", asyncHandle(RedisDataController.getAll));
router.put("/", asyncHandle(RedisDataController.updateOneById));
router.delete("/", asyncHandle(RedisDataController.delete));

export default router;
