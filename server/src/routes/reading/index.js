'use strict';
import express from 'express';
import ReadingController from '../../controllers/reading.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.post('/', asyncHandle(ReadingController.create));

router.get('/', asyncHandle(ReadingController.getAllWithQuery));
router.get('/get-id/:id', asyncHandle(ReadingController.getOneById));
router.put('/:id', asyncHandle(ReadingController.updateOneById));

router.post('/filters', asyncHandle(ReadingController.getAllWithFilters));

// QUERY
// router.get('/all', asyncHandle(TopicController.getAllTopic));

export default router;
