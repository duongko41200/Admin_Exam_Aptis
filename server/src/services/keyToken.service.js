'use strict';

const { Types } = require('mongoose');
const keytokenModel = require('../models/keytoken.model');

class keyTokenService {
	static createKeyToken = async ({
		userId,
		publicKey,
		privateKey,
		refreshToken,
	}) => {
		try {
			// const publicKeySting = publicKey.toString();
			//level 0
			// const token = await keytokenModel.create({
			// 	user: userId,
			// 	publicKey,
			// 	privateKey,
			// });
			//return token ? token.publicKey : null;

			//level xxx
			const filter = { user: userId },
				update = {
					publicKey,
					privateKey,
					refreshTokenUsed: [],
					refreshToken,
				},
				options = { upsert: true, new: true };
			const tokens = await keytokenModel.findOneAndUpdate(
				filter,
				update,
				options
			);
			return tokens ? tokens.publicKey : null;
		} catch (error) {
			return error;
		}
	};

	static findByUserId = async (userId) => {
		return await keytokenModel.findOne({ user: userId }).lean();
	};

	static removeKeyId = async (id) => {
		return await keytokenModel.deleteOne(id);
	};

	static findByRefreshTokenUsed = async (refreshToken) => {
		return await keytokenModel.findOne({
			refreshTokensUsed: refreshToken,
		}).lean();
	};

	static findByRefreshToken = async (refreshToken) => {
		return await keytokenModel.findOne({
			refreshToken,
		}).lean();
	};

	static deleteKeyById = async (userId) => {
		return await keytokenModel.deleteOne({
			user: userId
		}).lean();
	};
}

module.exports = keyTokenService;
