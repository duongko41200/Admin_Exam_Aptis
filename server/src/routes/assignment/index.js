'use strict';
import express from 'express';
import AssignmentController from '../../controllers/assignment.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
// import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
// router.use(authenticationV2);

router.post('/', asyncHandle(AssignmentController.create));
router.get('/', asyncHandle(AssignmentController.getAllWithQuery));
// router.get('/batch', asyncHandle(AssignmentController.getAll));
// router.post(
//     '/filters',
//     asyncHandle(AssignmentController.getAllWithFilters)
// );
// router.get(
//     '/get-id/:id',
//     asyncHandle(AssignmentController.getOneById)
// );

// router.put(
//     '/:id',
//     asyncHandle(AssignmentController.updateOneById)
// );
// router.delete(
//     '/:id',
//     asyncHandle(AssignmentController.deleteOneById)
// );
// router.get(
//     '/course-type/:courseType',
//     asyncHandle(AssignmentController.getAllWithFiltersCourseType)
// );

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
