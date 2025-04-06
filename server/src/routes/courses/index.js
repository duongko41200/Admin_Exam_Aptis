'use strict';
import express from 'express';
import CourseController from '../../controllers/course.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post('/', asyncHandle(CourseController.create));

router.get('/', asyncHandle(CourseController.getAllWithQuery));
router.get('/batch', asyncHandle(CourseController.getAll));
router.post(
	'/filters',
	asyncHandle(CourseController.getAllWithFilters)
);
router.get(
	'/get-id/:id',
	asyncHandle(CourseController.getOneById)
);

router.put(
	'/:id',
	asyncHandle(CourseController.updateOneById)
);
router.delete(
	'/:id',
	asyncHandle(CourseController.deleteOneById)
);
router.get(
	'/course-type/:courseType',
	asyncHandle(CourseController.getAllWithFiltersCourseType)
);

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
