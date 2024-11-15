'use strict';

const mongoose = require('mongoose');
const WritingModel = require('../models/writing.model');
const baseRepo = require('./base-repo/baseRepo');

class writingFactory {
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

	static updatewriting = async (id, data) => {
		console.log('data tesst:', data);
		return await WritingModel.findOneAndUpdate(
			{ _id: id },
			{ data },
			{ new: true }
		);
	};

	static deletewritingById = async (id) => {
		return await WritingModel.deleteOne({ _id: id }).lean();
	};

	static findAll = async () => {
		return await WritingModel.find().lean();
	};
}

module.exports = writingFactory;
