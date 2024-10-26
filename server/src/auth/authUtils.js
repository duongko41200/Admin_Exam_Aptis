'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandle } = require('../helpers/asyncHandle');
const {
	AuthFailureError,
	NotFoundError,
} = require('../cores/Error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
	API_KEY: 'x-api-key',
	CLIENT_ID: 'x-client-id',
	AUTHORIZATION: 'authorization',
	REFRESHTOKEN: 'x-rtoken-id',
};
const createTokenPair = async (payload, publicKey, privateKey) => {
	try {
		//accessToken
		const accessToken = await JWT.sign(payload, publicKey, {
			// algorithm: 'RS256',
			expiresIn: '2 days',
		});

		const refreshToken = await JWT.sign(payload, privateKey, {
			// algorithm: 'RS256',
			expiresIn: '7 days',
		});

		JWT.verify(accessToken, publicKey, (err, decode) => {
			if (err) {
				console.log('err verify token', err);
			} else {
				console.log('decode verify:', decode);
			}
		});
		return { accessToken, refreshToken };
	} catch (error) {}
};
const authentication = asyncHandle(async (req, res, next) => {
	/**
	 * 1- check userid missing
	 * 2- get accessToken
	 * 3-verify token
	 * 4- check user in dbs
	 * 5_check Key store with this userId
	 * 6_OK all => return next()
	 */

	const userId = req.headers[HEADER.CLIENT_ID];
	if (!userId) throw new AuthFailureError('Invalid Request');

	//2
	const KeyStore = await findByUserId(userId);

	if (!KeyStore) throw new NotFoundError('Not found KeyStore');

	//3
	const accessToken = req.headers[HEADER.AUTHORIZATION];
	if (!accessToken) throw new AuthFailureError('Invalid Request');

	//4
	try {
		const decodeUser = JWT.verify(accessToken, KeyStore.publicKey);

		// console.log({ decodeUser });
		if (userId !== decodeUser.userId)
			throw new AuthFailureError('Invalid Userid');
		req.keyStore = KeyStore;
		req.user = decodeUser;
		return next();
	} catch (error) {}
});

const authenticationV2 = asyncHandle(async (req, res, next) => {
	/**
	 * 1- check userid missing
	 * 2- get accessToken
	 * 3-verify token
	 * 4- check user in dbs
	 * 5_check Key store with this userId
	 * 6_OK all => return next()
	 */

	const userId = req.headers[HEADER.CLIENT_ID];
	if (!userId) throw new AuthFailureError('Invalid request: missing client id');

	//2
	const KeyStore = await findByUserId(userId);
	if (!KeyStore) throw new NotFoundError('Not found KeyStore');

	//3
	const refreshToken = req.headers[HEADER.REFRESHTOKEN];
	if (refreshToken) {
		try {
			const decodeUser = JWT.verify(refreshToken, KeyStore.privateKey);
			if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user');
			req.keyStore = KeyStore;
			req.user = decodeUser;
			req.refreshToken = refreshToken;
			return next();
		} catch (error) {
			throw error;
		}
	}

	const accessToken = req.headers[HEADER.AUTHORIZATION];
	if (!accessToken) throw new AuthFailureError('Invalid Request');

	//4
	try {
		const decodeUser = JWT.verify(accessToken, KeyStore.publicKey);

		// console.log({ decodeUser });
		if (userId !== decodeUser.userId)
			throw new AuthFailureError('Invalid Userid');
		req.keyStore = KeyStore;
		req.user = decodeUser;
		return next();
	} catch (error) {}
});

const verifyJWT = async (token, keySecret) => {
	return await JWT.verify(token, keySecret);
};

module.exports = {
	createTokenPair,
	authentication,
	verifyJWT,
	authenticationV2
};
