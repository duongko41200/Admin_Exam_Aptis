'use strict';

import baseRepo from './base-repo/baseRepo.js';
import userModel from '../models/user.model.js';

export const findByEmail = async ({
	email,
	select = {
		email: 1,
		password: 2,
		name: 1,
		status: 1,
		role: 1,
	},
}) => {
	return await userModel.findOne({ email }).select(select).lean();
};

export const getAllWithQuery = async ({ filter, range, sort }) => {
	return await baseRepo.getAllWithQuery(
		{ filter, range, sort },
		userModel
	);
};

export const getOneById = async (id) => {
	try {
		const res = await userModel.findOne({ _id: id }).lean();
		console.log({ res });

		return res;
	} catch (error) {
		console.log('lỗi rồi:', error);

		return [];
	}
};
