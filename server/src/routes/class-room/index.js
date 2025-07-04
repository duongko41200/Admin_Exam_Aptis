"use strict";
import express from "express";
import ClassRoomController from "../../controllers/classRoom.controller.js";
import { asyncHandle } from "../../auth/checkAuth.js";
// import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
// router.use(authenticationV2);

router.post("/", asyncHandle(ClassRoomController.create));
router.get("/", asyncHandle(ClassRoomController.getAllWithQuery));
router.get("/batch", asyncHandle(ClassRoomController.getAll));

router.get("/get-id/:id", asyncHandle(ClassRoomController.getOneById));

router.put("/:id", asyncHandle(ClassRoomController.updateOneById));
router.delete("/:id", asyncHandle(ClassRoomController.deleteOneById));

export default router;
