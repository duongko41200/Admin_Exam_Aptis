'use strict';

import mongoose from 'mongoose';
import { LecturesModel } from '../models/course/lecture.model.js';
import baseRepo from './base-repo/baseRepo.js';

class LecturesFactory {
	static createTestBank = async (data) => {
		try {
			const reading = await LecturesModel.create(data);
			return reading ? reading : null;
		} catch (error) {
			console.log('error: là: ', error);
			return error;
		}
	};
	static getOneById = async (id) => {
		return await baseRepo.getOneById({ id }, LecturesModel);
	};

	static getAllWithQuery = async ({ filter, range, sort }) => {
		return await baseRepo.getAllWithQuery(
			{ filter, range, sort },
			LecturesModel
		);
	};
	static updateOneById = async (id, data) => {
		console.log('data tesst:', data);
		return await LecturesModel.findOneAndUpdate(
			{ _id: id },
			{ ...data },
			{ new: true }
		);
	};

	static getAllWithFilters = async ({ partSkill }) => {
		return await baseRepo.getAllWithFilters(
			{ partSkill },
			LecturesModel
		);
	};
	static getAll = async () => {
		return await baseRepo.getAll(LecturesModel);
	};

	static findById = async (id) => {
		return await LecturesModel.findById(id).lean();
	};

	static updateTestBank = async (id, updateData) => {
		const options = { new: true };
		return await LecturesModel.findByIdAndUpdate(
			id,
			updateData,
			options
		);
	};

	static deleteTestBankById = async (id) => {
		return await LecturesModel.deleteOne({ _id: id }).lean();
	};
	static getAllWithFiltersCourseType = async (filter) => {
		return await LecturesModel.find({
			lectureType: filter,
		}).lean();
	};

	static findAll = async () => {
		return await LecturesModel.find().lean();
	};
}

export default LecturesFactory;
