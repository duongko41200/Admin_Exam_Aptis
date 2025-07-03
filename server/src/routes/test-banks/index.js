'use strict';
import express from 'express';
import TestBankController from '../../controllers/testBank.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post('/', asyncHandle(TestBankController.create));

router.get('/', asyncHandle(TestBankController.getAllWithQuery));
router.get('/batch', asyncHandle(TestBankController.getAll));
router.post(
	'/filters',
	asyncHandle(TestBankController.getAllWithFilters)
);
router.get(
	'/get-id/:id',
	asyncHandle(TestBankController.getOneById)
);

router.put(
	'/:id',
	asyncHandle(TestBankController.updateOneById)
);


router.delete("/:id", asyncHandle(TestBankController.deleteById));
// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
