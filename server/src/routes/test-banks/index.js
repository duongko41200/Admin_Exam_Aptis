"use strict";
import express from "express";
import { authenticationV2 } from "../../auth/authUtils.js";
import { asyncHandle } from "../../auth/checkAuth.js";
import TestBankController from "../../controllers/testBank.controller.js";

const router = express.Router();

//Authen//
router.use(authenticationV2);

// api 
router.post("/", asyncHandle(TestBankController.create));
router.get("/", asyncHandle(TestBankController.getAllWithQuery));
router.get("/batch", asyncHandle(TestBankController.getAll));
router.post("/filters", asyncHandle(TestBankController.getAllWithFilters));
router.put("/:id", asyncHandle(TestBankController.updateOneById));
router.get("/get-id/:id", asyncHandle(TestBankController.getOneById));
router.get("/extend/:id", asyncHandle(TestBankController.getOneExtendById));
router.delete("/:id", asyncHandle(TestBankController.deleteById));
router.post("/query", asyncHandle(TestBankController.findQuery));

export default router;
