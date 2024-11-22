'use strict';
import express from 'express';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';
import userController from '../../controllers/userController.js';

const router = express.Router();

//Authen//
router.use(authenticationV2);

router.get('/', asyncHandle(userController.getAllWithQuery));

// QUERY
router.get('/:id', asyncHandle(userController.getOneById));

export default router;
