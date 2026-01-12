'use strict';

import ReadingModel from '../models/reading.model.js';
import baseRepo from './base-repo/baseRepo.js';

class ReadingFactory {
	static createReading = async ({
		title,
		timeToDo,
		questions,
		skill,
		description,
	}) => {
		try {
			const readingData = {
				data: {
					title,
					timeToDo,
					questions,
					skill,
					description,
				},
			};

			console.log('readingData:', readingData);
			const reading = await ReadingModel.create(readingData);
			return reading ? reading : null;
		} catch (error) {
			console.log('error: là: ', error);
			return error;
		}
	};
	static getAllWithQuery = async ({ filter, range, sort }) => {
		return await baseRepo.getAllWithQueryReading(
      { filter, range, sort },
      ReadingModel
    );
	};

	static getOneById = async (id) => {
		return await baseRepo.getOneById({ id }, ReadingModel);
	};

	static getAllWithFilters = async ({ partSkill }) => {
		return await baseRepo.getAllWithFilters(
			{ partSkill },
			ReadingModel
		);
	};

	static findById = async (id) => {
		return await ReadingModel.findById(id).lean();
	};

	static updateReading = async (id, data) => {
		console.log('data tesst:', data);
		return await ReadingModel.findOneAndUpdate({ _id: id }, {data}, { new: true });
	};

	static deleteReadingById = async (id) => {
		return await ReadingModel.deleteOne({ _id: id }).lean();
	};

	static findAll = async () => {
		return await ReadingModel.find().lean();
	};
}

export default ReadingFactory;
