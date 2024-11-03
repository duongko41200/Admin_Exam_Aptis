'use strict';
const express = require('express');
const router = express.Router();
const TestBankController = require('../../controllers/testBank.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const {
	authentication,
	authenticationV2,
} = require('../../auth/authUtils');

//Authen//
router.use(authenticationV2);

router.post('/', asyncHandle(TestBankController.create));

router.get('/', asyncHandle(TestBankController.getAllWithQuery));
router.get('/batch', asyncHandle(TestBankController.getAll));
router.post(
	'/filters',
	asyncHandle(TestBankController.getAllWithFilters)
);

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

module.exports = router;
