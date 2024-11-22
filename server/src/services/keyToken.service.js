'use strict';


import keytokenModel from '../models/keytoken.model.js';

class keyTokenService {
	static createKeyToken = async ({
		userId,
		publicKey,
		privateKey,
		refreshToken,
	}) => {
		try {
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

export default keyTokenService;
