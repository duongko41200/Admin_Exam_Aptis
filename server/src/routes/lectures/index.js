'use strict';
import express from 'express';
import LecturesController from '../../controllers/lectures.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post('/', asyncHandle(LecturesController.create));

router.get('/', asyncHandle(LecturesController.getAllWithQuery));
router.get('/batch', asyncHandle(LecturesController.getAll));
router.post(
	'/filters',
	asyncHandle(LecturesController.getAllWithFilters)
);
router.get(
	'/get-id/:id',
	asyncHandle(LecturesController.getOneById)
);

router.put(
	'/:id',
	asyncHandle(LecturesController.updateOneById)
);
router.delete(
	'/:id',
	asyncHandle(LecturesController.deleteById)
);
router.get(
	'/course-type/:courseType',
	asyncHandle(LecturesController.getAllWithFiltersCourseType)
);

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
