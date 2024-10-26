'use strict';
const mongoose = require('mongoose');
const safetyCount = require('../../helpers/safetyCount');
const { text, word, sentence } = require('../../models/textform.model');
const TopicModel = require('../../models/topic.model');
const { Types } = mongoose;
const dayjs = require('dayjs');

const getAll = async ({ userId, model }) => {
	console.log('userId', userId);

	const getAll = await model
		.find({ userId })
		.populate('topicId')
		.lean();

	return {
		// total: count,
		// count: AllRecords.length,
		// totalPages: Math.ceil(count / limit),
		// currentPage: parseInt(page),
		contents: getAll,
	};
};

const findAllInfoText = async ({ model, query, limit, page }) => {
	const countPromise = safetyCount({ model: model, query });
	console.log({ query });
	const resDataPromise = text
		.find(query)
		.populate('topicId')
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit)
		.lean();

	const [count, resData] = await Promise.all([
		countPromise,
		resDataPromise,
	]);

	return {
		total: count,
		// count: AllRecords.length,
		totalPages: Math.ceil(count / limit),
		currentPage: parseInt(page),
		contents: resData,
	};
};

const findListTextByFilter = async ({
	model,
	userId,
	limit,
	page,
	level,
	typeText,
	date,
}) => {
	const query = {};

	if (level != 'all') query['repeat'] = +level;
	if (typeText != 'all') query['typeText'] = typeText;

	const countPromise = model
		.find({
			userId,
			createdAt: {
				$gte: dayjs(`${date}-01`).startOf('day'),
				$lte: dayjs(`${date}-31`).startOf('day'),
			},
			...query,
		})
		.countDocuments();
	const resDataPromise = model
		.find({
			userId,
			createdAt: {
				$gte: dayjs(`${date}-01`).startOf('day'),
				$lte: dayjs(`${date}-31`).startOf('day'),
			},
			...query,
		})
		.populate('topicId')
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit)
		.lean();

	const [count, resData] = await Promise.all([
		countPromise,
		resDataPromise,
	]);
	return {
		total: count,
		// count: AllRecords.length,
		totalPages: Math.ceil(count / limit),
		currentPage: parseInt(page),
		contents: resData,
	};
};

const deleteText = async ({
	userId,
	textId,
	limit,
	page,
	level,
	date,
	typeText,
	model,
}) => {
	try {
		const textDeleted = await model.deleteMany({ _id: textId, userId });
		return await findListTextByFilter({
			model,
			userId,
			limit,
			page,
			level,
			typeText,
			date,
		});
	} catch (error) {
		console.log({ error });
		// return next(new AppError('No product found with that id', 404));
	}
};

const updateTextById = async ({
	textId,
	textName,
	defind,
	attributes,
	topicId,
	model,
}) => {
	try {
		const textUpdate = await model.findOneAndUpdate(
			{ _id: textId },
			{
				text: textName,
				defind,
				topicId,
				attributes,
			}
		);

		return {
			contents: textUpdate,
		};
	} catch (error) {
		console.log({ error });
	}
};

const pendingReview = async ({ userId, model }) => {
	try {
		const listPenddingReview = await model.find({
			userId,
			dayReview: dayjs(new Date()).format('YYYY/MM/DD'),
		});
		console.log({ listPenddingReview });

		return {
			contents: listPenddingReview,
		};
	} catch (error) {
		console.log({ error });
	}
};

///TOPIC

const createTopic = async ({ name, userId }) => {
	return await TopicModel.create({ name: name, userId: userId });
};
const getAllTopc = async () => {
	return await TopicModel.find();
};

const updateLevelText = async ({
	textId,
	repeat,
	dayReview,
	model,
}) => {
	try {
		const textUpdate = await model.findOneAndUpdate(
			{ _id: textId },
			{ repeat, dayReview },
			{ new: true }
		);

		return { contents: textUpdate };
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

// Đồng bộ data từ desktop app sang mobile
const synchData = async ({
	dataCreate,
	dataDelete,
	dataUpdate,
	model,
}) => {
	const bulkOperations = [];

	console.log({ dataCreate, dataDelete, dataUpdate });
	try {
		let dataCreates = JSON.parse(dataCreate) ?? [];
		let dataDeletes = JSON.parse(dataDelete) ?? [];
		let dataUpdates = JSON.parse(dataUpdate) ?? [];

		console.log({ dataCreates, dataDeletes, dataUpdates });

		if (dataCreates.length > 0) {
			dataCreates = dataCreates.map((value) => {
				delete value._id;

				return value;
			});
		}

		if (dataCreates.length > 0) {
			dataCreates.forEach((doc) => {
				bulkOperations.push({ insertOne: { document: doc } });
			});
		}

		if (dataUpdates.length > 0) {
			dataUpdates.forEach((doc) => {
				bulkOperations.push({
					updateOne: {
						filter: { _id: doc._id },
						update: { $set: doc },
						upsert: true,
					},
				});
			});
		}

		if (dataDeletes.length > 0) {
			dataDeletes.forEach((doc) => {
				bulkOperations.push({
					deleteOne: {
						filter: { _id: doc._id },
					},
				});
			});
		}

		const result = await model.bulkWrite(bulkOperations);

		return 'ok';
	} catch (error) {
		console.error('Error performing bulk operations:', error);
	}
};

const getAllWithQuery = async ({
	filter,
	range,
	sort,
	userId,
	model,
}) => {
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

	try {
		const res = await model
			.find({ _id: userId })
			.sort({ _id: sortOrder === 'ASC' ? 1 : -1 })
			.skip(start || 0)
			.limit((end || 0) - (start || 0) + 1)
			.exec();
		return res;
	} catch (error) {
		console.log('error:', error);
	}
};

module.exports = {
	findAllInfoText,
	createTopic,
	getAllTopc,
	findListTextByFilter,
	deleteText,
	updateTextById,
	pendingReview,
	updateLevelText,
	getAllWithQuery,
	synchData,
	getAll,
};
