'use strict';
const express = require('express');
const router = express.Router();
const TextFormController = require('../../controllers/textForm.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const {
	authentication,
	authenticationV2,
} = require('../../auth/authUtils');

//Authen//
router.use(authenticationV2);

router.post(
	'/info/all',
	asyncHandle(TextFormController.createTextForm)
);

// QUERY
router.get('/all-text', asyncHandle(TextFormController.getAll));
router.get('/all', asyncHandle(TextFormController.getAllInfoText));
router.get('/get-all', asyncHandle(TextFormController.getAllInfoText));

router.get('/', asyncHandle(TextFormController.getAllWithQuery));
router.get(
	'/review',
	asyncHandle(TextFormController.getListTextByFilter)
);
router.delete('/delete', asyncHandle(TextFormController.deleteText));
router.patch(
	'/update-id',
	asyncHandle(TextFormController.updateTextbyId)
);
router.get(
	'/listPending',
	asyncHandle(TextFormController.getPendingReview)
);
router.patch(
	'/update-level',
	asyncHandle(TextFormController.updateLevelText)
);
router.post('/synch', asyncHandle(TextFormController.synchDataText));

module.exports = router;
