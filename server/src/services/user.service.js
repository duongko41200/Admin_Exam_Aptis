'use strict';

const baseRepo = require('./base-repo/baseRepo');

const userModel = require('../models/user.model');

const findByEmail = async ({
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

const getAllWithQuery = async ({ filter, range, sort }) => {
	return await baseRepo.getAllWithQuery({ filter, range, sort }, userModel);
};

const getOneById = async (id) => {
	try {
		const res = await userModel.findOne({ _id: id }).lean();
		console.log({ res });

		return res;
	} catch (error) {
		console.log('lỗi rồi:', error);

		return [];
	}
};

module.exports = {
	findByEmail,
	getAllWithQuery,
	getOneById,
};
