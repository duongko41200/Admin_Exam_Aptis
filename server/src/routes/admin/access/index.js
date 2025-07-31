"use strict";
import express from "express";
import { authenticationV2 } from "../../../auth/authUtils.js";
import { asyncHandle } from "../../../auth/checkAuth.js";
import AdminAccessController from "../../../controllers/adminAccess.controller.js";

const router = express.Router();

router.post("/access/signup", asyncHandle(AdminAccessController.signUp));
router.post("/access/login", asyncHandle(AdminAccessController.login));

// Authen //
router.use(authenticationV2);

router.post("/access/logout", asyncHandle(AdminAccessController.logout));
router.post(
  "/access/handleRefreshToken",
  asyncHandle(AdminAccessController.handleRefreshToken)
);

export default router;
