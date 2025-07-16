"use strict";
import express from "express";
import { apiKey, permission } from "../auth/checkAuth.js";
import accessRouter from "./access/index.js"; // Thay đổi require bằng import
import listeningRouter from "./listening/index.js";
import readingRouter from "./reading/index.js"; // Thay đổi require bằng import
import speakingRouter from "./speaking/index.js";
import testBanksRouter from "./test-banks/index.js"; // Thay đổi require bằng import
import userRouter from "./user/index.js"; // Thay đổi require bằng import
import writingRouter from "./writing/index.js"; // Thay đổi require bằng import
import redisDataRouter from "./redis-data/index.js"; // Thay đổi require bằng import
import assignmentRouter from "./assignment/index.js"; // Thay đổi require bằng import
import classRoomRouter from "./class-room/index.js"; // Thay đổi require bằng import
import courseRouter from "./courses/index.js"; // Thay đổi require bằng import
import lectureRouter from "./lectures/index.js"; // Thay đổi require bằng import

const router = express.Router();

//check apiKey middleware
router.use(apiKey);

//check permission

router.unsubscribe(String(permission("000")));

// Các route
router.use("/v1/api", accessRouter);

router.use("/v1/api/users", userRouter);
router.use("/v1/api/readings", readingRouter);
router.use("/v1/api/test-banks", testBanksRouter);
router.use("/v1/api/writings", writingRouter);

router.use("/v1/api/speakings", speakingRouter);
router.use("/v1/api/listenings", listeningRouter);
router.use("/v1/api/courses", courseRouter);
router.use("/v1/api/lectures", lectureRouter);
router.use("/v1/api/assignments", assignmentRouter);
router.use("/v1/api/classrooms", classRoomRouter);
router.use("/v1/api/cache-data", redisDataRouter);


export default router;
