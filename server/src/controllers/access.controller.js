'use strict';

const AccessService = require('../services/access.service');
const {
	OK,
	CREATED,
	SuccessResponse,
} = require('../cores/success.response.js');

class AccessController {
	handleRefreshToken = async (req, res, next) => {
		// V1
		// new SuccessResponse({
		// 	message: 'Get token successfully!',
		// 	metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
		// }).send(res);

		// V2 fixed, no need accessToken
		new SuccessResponse({
			message: 'Get token successfully!',
			metadata: await AccessService.handleRefreshTokenV2({
				refreshToken: req.refreshToken,
				user: req.user,
				keyStore: req.keyStore,
			}),
		}).send(res);
	};

	logout = async (req, res, next) => {
		new SuccessResponse({
			message: 'logout success',
			metadata:await AccessService.logout({ keyStore: req.keyStore })
		}).send(res);
	};

	login = async (req, res, next) => {
		new SuccessResponse({
			metadata: await AccessService.login(req.body),
		}).send(res);
	};

	signUp = async (req, res, next) => {
		console.log(`Accessing`, req.body);
		// return res.status(200).json(await AccessService.signUp(req.body));

		new CREATED({
			message: 'success',
			metadata: await AccessService.signUp(req.body),
		}).send(res);
	};
}

module.exports = new AccessController();
