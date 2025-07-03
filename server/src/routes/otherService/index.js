'use strict';
import express from 'express';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';
import otherServiceController from '../../controllers/otherService.controller.js';

const router = express.Router();

//Authen//
router.use(authenticationV2);

// QUERY
router.get(
	'/text-to-voice',
	asyncHandle(otherServiceController.textToVoice)
);

export default router;
