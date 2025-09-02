"use strict";
import express from "express";
import { apiKey, permission } from "../auth/checkAuth.js";
import accessRouter from "./access/index.js";
import listeningRouter from "./listening/index.js";
import readingRouter from "./reading/index.js";
import speakingRouter from "./speaking/index.js";
import testBanksRouter from "./test-banks/index.js";
import userRouter from "./user/index.js";
import writingRouter from "./writing/index.js";
import redisDataRouter from "./redis-data/index.js";
import assignmentRouter from "./assignment/index.js";
import classRoomRouter from "./class-room/index.js";
import courseRouter from "./courses/index.js";
import lectureRouter from "./lectures/index.js";
import studyProcessRouter from "./study-process/index.js";
import adminAccessRouter from "./admin/access/index.js";
import r2Router from "./r2/index.js";
import videoRouter from "./videos-upload/index.js";

const router = express.Router();

//check apiKey middleware
router.use(apiKey);

//check permission

router.unsubscribe(String(permission("000")));

router.use("/v1/api/admin", adminAccessRouter);

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
router.use("/v1/api/study-process", studyProcessRouter);
router.use("/v1/api/r2", r2Router);
router.use("/v1/api/video", videoRouter);

export default router;
