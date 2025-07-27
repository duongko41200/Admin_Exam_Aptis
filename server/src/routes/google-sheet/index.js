"use strict";
import express from "express";
import GoogleSheetController from "../../controllers/googleSheet.controller.js";
import { asyncHandle } from "../../auth/checkAuth.js";
// import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
// router.use(authenticationV2);

router.post("/", asyncHandle(GoogleSheetController.create));
router.get("/", asyncHandle(GoogleSheetController.getAllWithQuery));
router.get("/batch", asyncHandle(GoogleSheetController.getAll));

router.get("/get-id/:id", asyncHandle(GoogleSheetController.getOneById));

router.put("/:id", asyncHandle(GoogleSheetController.updateOneById));
router.delete("/:id", asyncHandle(GoogleSheetController.deleteOneById));

export default router;
