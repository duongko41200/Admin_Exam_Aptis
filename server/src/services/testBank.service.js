'use strict';

const mongoose = require('mongoose');
const TestBankModel = require('../models/testBank.model');
const baseRepo = require('./base-repo/baseRepo');

class TestBankFactory {
	static createTestBank = async (data) => {
		try {
			const reading = await TestBankModel.create(data);
			return reading ? reading : null;
		} catch (error) {
			console.log('error: là: ', error);
			return error;
		}
	};

	static getAllWithQuery = async ({ filter, range, sort }) => {
		return await baseRepo.getAllWithQuery(
			{ filter, range, sort },
			TestBankModel
		);
	};

	static getAllWithFilters = async ({ partSkill }) => {
		return await baseRepo.getAllWithFilters(
			{ partSkill },
			TestBankModel
		);
	};
	static getAll = async () => {
		return await baseRepo.getAll(TestBankModel);
	};

	static findById = async (id) => {
		return await TestBankModel.findById(id).lean();
	};

	static updateTestBank = async (id, updateData) => {
		const options = { new: true };
		return await TestBankModel.findByIdAndUpdate(
			id,
			updateData,
			options
		);
	};

	static deleteTestBankById = async (id) => {
		return await TestBankModel.deleteOne({ _id: id }).lean();
	};

	static findAll = async () => {
		return await TestBankModel.find().lean();
	};
}

module.exports = TestBankFactory;