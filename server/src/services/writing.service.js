'use strict';


import WritingModel from '../models/writing.model.js';
import baseRepo from './base-repo/baseRepo.js';

class WritingFactory {
	static createWriting = async (data) => {
		try {
			const writing = await WritingModel.create(data);
			return writing ? writing : null;
		} catch (error) {
			console.log('error: là: ', error);
			return error;
		}
	};

	static getAllWithQuery = async ({ filter, range, sort }) => {
		return await baseRepo.getAllWithQuery(
			{ filter, range, sort },
			WritingModel
		);
	};

	static getOneById = async (id) => {
		return await baseRepo.getOneById({ id }, WritingModel);
	};

	static getAllWithFilters = async ({ partSkill }) => {
		return await baseRepo.getAllWithFiltersWritting(
			{ partSkill },
			WritingModel
		);
	};

	static findById = async (id) => {
		return await WritingModel.findById(id).lean();
	};

	static updateWriting = async (id, data) => {
		console.log('data tesst:', data);
		return await WritingModel.findOneAndUpdate(
			{ _id: id },
			{ ...data },
			{ new: true }
		);
	};

	static deleteWritingById = async (id) => {
		return await WritingModel.deleteOne({ _id: id }).lean();
	};

	static findAll = async () => {
		return await WritingModel.find().lean();
	};
}

export default WritingFactory;
