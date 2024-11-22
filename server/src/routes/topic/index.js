'use strict';
import express from 'express';
import TopicController from '../../controllers/topic.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post(
	'/create',
	asyncHandle(TopicController.createTopic)
);

// QUERY
router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
