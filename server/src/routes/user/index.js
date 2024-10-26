'use strict';
const express = require('express');
const router = express.Router();
const TopicController = require('../../controllers/topic.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const {
	authentication,
	authenticationV2,
} = require('../../auth/authUtils');
const userController = require('../../controllers/userController');

//Authen//
router.use(authenticationV2);

router.get('/', asyncHandle(userController.getAllWithQuery));

// QUERY
router.get('/:id', asyncHandle(userController.getOneById));

module.exports = router;
