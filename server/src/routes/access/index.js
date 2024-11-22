'use strict';
import express from 'express';
import AccessController from '../../controllers/access.controller.js';
import { asyncHandle } from '../../auth/checkAuth.js';
import { authentication, authenticationV2 } from '../../auth/authUtils.js';

const router = express.Router();

router.post('/access/signup', asyncHandle(AccessController.signUp));
router.post('/access/login', asyncHandle(AccessController.login));

// Authen //
router.use(authenticationV2);

router.post('/access/logout', asyncHandle(AccessController.logout));
router.post('/access/handleRefreshToken', asyncHandle(AccessController.handleRefreshToken));

export default router;
