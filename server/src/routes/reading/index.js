'use strict';
const express = require('express');
const router = express.Router();
const ReadingController = require('../../controllers/reading.controller')
const { asyncHandle } = require('../../auth/checkAuth');
const {
	authentication,
	authenticationV2,
} = require('../../auth/authUtils');

//Authen//
router.use(authenticationV2);

router.post(
	'/',
	asyncHandle(ReadingController.create)
);

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

module.exports = router;
