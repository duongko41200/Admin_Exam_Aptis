'use strict';
import express from 'express';
import speakingController from '../../controllers/speaking.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';
import multer from 'multer'
const storage = multer.memoryStorage(); // Dữ liệu sẽ được lưu vào bộ nhớ RAM
const upload = multer({ storage: storage });

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post('/', upload.single("file"), asyncHandle(speakingController.create));

router.get('/', asyncHandle(speakingController.getAllWithQuery));
router.get(
	'/get-id/:id',
	asyncHandle(speakingController.getOneById)
);
router.put(
	'/:id',
	asyncHandle(speakingController.updateOneById)
);

router.post(
	'/filters',
	asyncHandle(speakingController.getAllWithFilters)
);

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
