'use strict';
const express = require('express');
const router = express.Router();
const { asyncHandle } = require('../../auth/checkAuth');
const {
	authentication,
	authenticationV2,
} = require('../../auth/authUtils');
const otherServiceController = require('../../controllers/otherService.controller');

//Authen//
router.use(authenticationV2);

// QUERY
router.get(
	'/text-to-voice',
	asyncHandle(otherServiceController.textToVoice)
);

module.exports = router;
