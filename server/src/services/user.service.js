'use strict';
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
	const [sortField, sortOrder] = sort;
	const [start, end] = range;

	console.log({ sort });

	// console.log()
	// const [sortField, sortOrder] = sort;
	// const [start, end] = range;

	// const whereClause = Object.fromEntries(
	//   Object.entries(filter).map(([key, value]) => [
	//     key,
	//     {
	//       search: (value)
	//         .trim()
	//         .split(' ')
	//         .map((word) => `${word} ${word}*`.toLowerCase())
	//         .join(' '),
	//     },
	//   ])
	// );

	const res = await userModel
		.find()
		.sort({ _id: sortOrder === 'ASC' ? 1 : -1 })
		.skip(start || 0)
		.limit((end || 0) - (start || 0) + 1)
		.exec();

	return res;
};

const getOneById = async (id) => {
	try {
		const res = await userModel.findOne({ _id: id }).lean();
		console.log({ res });

		return res;
	} catch (error) {
		console.log('lỗi rồi:', error);

		return []
	}
};

module.exports = {
	findByEmail,
	getAllWithQuery,
	getOneById,
};
