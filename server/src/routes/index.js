'use strict';
import express from 'express';
import { apiKey, permission } from '../auth/checkAuth.js';
import accessRouter from './access/index.js'; // Thay đổi require bằng import
import textFormRouter from './textForm/index.js'; // Thay đổi require bằng import
import topicRouter from './topic/index.js'; // Thay đổi require bằng import
import otherServiceRouter from './otherService/index.js'; // Thay đổi require bằng import
import userRouter from './user/index.js'; // Thay đổi require bằng import
import readingRouter from './reading/index.js'; // Thay đổi require bằng import
import testBanksRouter from './test-banks/index.js'; // Thay đổi require bằng import
import writingRouter from './writing/index.js'; // Thay đổi require bằng import
import speakingRouter from './speaking/index.js'

const router = express.Router();

//check apiKey middleware
router.use(apiKey);

//check permission
router.unsubscribe(String(permission("000")));

// Các route
router.use('/v1/api', accessRouter);
router.use('/v1/api/text', textFormRouter);
router.use('/v1/api/topic', topicRouter);
router.use('/v1/api/other', otherServiceRouter);
router.use('/v1/api/users', userRouter);
router.use('/v1/api/readings', readingRouter);
router.use('/v1/api/test-banks', testBanksRouter);
router.use('/v1/api/writings', writingRouter);

router.use('/v1/api/speakings', speakingRouter);

export default router;
