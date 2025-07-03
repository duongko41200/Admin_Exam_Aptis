'use strict';

import { SuccessResponse } from '../cores/success.response.js';
import { createTopic, getAllTopc } from '../models/respositories/text.repo.js';
import ReadingFactory from '../services/reading.service.js';

class ReadingController {
	create = async (req, res, next) => {
		// console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: await ReadingFactory.createReading(req.body),
		}).send(res);
	};

	getAllWithQuery = async (req, res, next) => {
		const params = req.query;

		const filter = JSON.parse(params.filter);

		const range = JSON.parse(params.range);

		const sort = JSON.parse(params.sort);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await ReadingFactory.getAllWithQuery({ filter, range, sort }),
		}).send(res);
	};
	getOneById = async (req, res, next) => {
		const { id } = req.params;

		console.log('id:', id);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await ReadingFactory.getOneById(id),
		}).send(res);
	};

	updateOneById = async (req, res, next) => {
		const { id } = req.params;
		const data = req.body;

		new SuccessResponse({
			message: 'update new Reading success!',
			metadata: await ReadingFactory.updateReading(id, data),
		}).send(res);
	};

	getAllWithFilters = async (req, res, next) => {
		console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await ReadingFactory.getAllWithFilters(req.body),
		}).send(res);
	};
	// //QUERY//

	getAllTopic = async (req, res, next) => {
		// console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: await ReadingFactory.getAllTopc(),
		}).send(res);
	};
	//END QUERY
}

export default new ReadingController();
