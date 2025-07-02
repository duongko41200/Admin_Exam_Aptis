'use strict';
import express from 'express';
import WritingController from '../../controllers/writing.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

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
router.delete("/:id", asyncHandle(WritingController.deleteById));
// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
