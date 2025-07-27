"use strict";
import express from "express";
import { authenticationV2 } from '../../auth/authUtils.js';
import { asyncHandle } from "../../auth/checkAuth.js";
import AssignmentController from "../../controllers/assignment.controller.js";

const router = express.Router();

// Authen//
router.use(authenticationV2);

router.post("/", asyncHandle(AssignmentController.create));
router.get("/", asyncHandle(AssignmentController.getAllWithQuery));
router.get("/batch", asyncHandle(AssignmentController.getAll));

router.get("/get-id/:id", asyncHandle(AssignmentController.getOneById));

router.put("/:id", asyncHandle(AssignmentController.updateOneById));
router.delete("/:id", asyncHandle(AssignmentController.deleteOneById));

export default router;
