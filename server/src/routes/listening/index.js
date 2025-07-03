"use strict";
import express from "express";
import listeningController from "../../controllers/listening.controller.js";
import { asyncHandle } from "../../auth/checkAuth.js";
import { authentication, authenticationV2 } from "../../auth/authUtils.js";
import multer from "multer";
import uploadCloud from "../../utils/uploadFile/cloudinary.js";

const storage = multer.memoryStorage(); // Dữ liệu sẽ được lưu vào bộ nhớ RAM
const upload = multer({ storage: storage });

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post("/", asyncHandle(listeningController.create));

router.post(
  "/create-part-image",
  uploadCloud.array("files", 2), 
  asyncHandle(listeningController.createImage)
);

router.get("/", asyncHandle(listeningController.getAllWithQuery));
router.get("/get-id/:id", asyncHandle(listeningController.getOneById));
router.put("/:id", asyncHandle(listeningController.updateOneById));

router.post("/filters", asyncHandle(listeningController.getAllWithFilters));
router.delete("/:id", asyncHandle(listeningController.deleteById));


export default router;
