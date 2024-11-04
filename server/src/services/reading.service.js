'use strict';

const mongoose = require('mongoose');
const ReadingModel = require('../models/reading.model');
const baseRepo = require('./base-repo/baseRepo');

class ReadingFactory {
    static createReading = async ({ title, timeToDo, questions, skill, description }) => {
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
        return await baseRepo.getAllWithQuery({ filter, range, sort }, ReadingModel);
    };

    static getOneById = async (id) => {
        return await baseRepo.getOneById({ id}, ReadingModel);
    };

    static getAllWithFilters = async ({ partSkill }) => {
        return await baseRepo.getAllWithFilters({ partSkill}, ReadingModel);
    };

    static findById = async (id) => {
        return await ReadingModel.findById(id).lean();
    };

    static updateReading = async (id, updateData) => {
        const options = { new: true };
        return await ReadingModel.findByIdAndUpdate(id, updateData, options);
    };

    static deleteReadingById = async (id) => {
        return await ReadingModel.deleteOne({ _id: id }).lean();
    };

    static findAll = async () => {
        return await ReadingModel.find().lean();
    };
}

module.exports = ReadingFactory;
