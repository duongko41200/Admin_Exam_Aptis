'use strict';
const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const {authentication, authenticationV2} = require('../../auth/authUtils')

router.post('/access/signup', asyncHandle(AccessController.signUp));
router.post('/access/login', asyncHandle(AccessController.login));

//Authen//
router.use(authenticationV2)

router.post('/access/logout', asyncHandle(AccessController.logout));
router.post('/access/handleRefreshToken', asyncHandle(AccessController.handleRefreshToken));

module.exports = router;
