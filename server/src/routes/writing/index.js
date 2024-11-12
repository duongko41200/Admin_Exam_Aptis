'use strict';
const express = require('express');
const router = express.Router();
const WritingController = require('../../controllers/writing.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const {
	authentication,
	authenticationV2,
} = require('../../auth/authUtils');

//Authen//
router.use(authenticationV2);

router.post('/', asyncHandle(WritingController.create));

router.get('/', asyncHandle(WritingController.getAllWithQuery));
router.get(
	'/get-id/:id',
	asyncHandle(WritingController.getOneById)
);
router.put(
	'/:id',
	asyncHandle(WritingController.updateOneById)
);

router.post(
	'/filters',
	asyncHandle(WritingController.getAllWithFilters)
);

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

module.exports = router;
