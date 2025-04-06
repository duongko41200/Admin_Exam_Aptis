'use strict';

import mongoose from 'mongoose';
import { CourseModel } from '../models/course/course.model.js';
import baseRepo from './base-repo/baseRepo.js';

class CourseFactory {
	static createTestBank = async (data) => {
		try {
			const reading = await CourseModel.create(data);
			return reading ? reading : null;
		} catch (error) {
			console.log('error: là: ', error);
			return error;
		}
	};
	static getOneById = async (id) => {
		return await baseRepo.getOneById({ id }, CourseModel);
	};

	static getAllWithQuery = async ({ filter, range, sort }) => {
		return await baseRepo.getAllWithQuery(
			{ filter, range, sort },
			CourseModel
		);
	};
	static updateOneById = async (id, data) => {
		console.log('data tesst:', data);
		return await CourseModel.findOneAndUpdate(
			{ _id: id },
			{ ...data },
			{ new: true }
		);
	};

	static getAllWithFilters = async ({ partSkill }) => {
		return await baseRepo.getAllWithFilters({ partSkill }, CourseModel);
	};
	static getAll = async () => {
		return await baseRepo.getAll(CourseModel);
	};
	static getAllWithFiltersCourseType = async (filter) => {
		return await CourseModel.find({
			courseType: filter,
		}).lean();
	};

	static findById = async (id) => {
		return await CourseModel.findById(id).lean();
	};

	static updateTestBank = async (id, updateData) => {
		const options = { new: true };
		return await CourseModel.findByIdAndUpdate(id, updateData, options);
	};

	static deleteTestBankById = async (id) => {
		return await CourseModel.deleteOne({ _id: id }).lean();
	};

	static findAll = async () => {
		return await CourseModel.find().lean();
	};
}

export default CourseFactory;
