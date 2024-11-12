'use strict';

const { SuccessResponse } = require('../cores/success.response.js');
const {
	createTopic,
	getAllTopc,
} = require('../models/respositories/text.repo.js');
const { createWriting } = require('../services/writing.service.js');
const {
	getAllWithQuery,
	getOneById,
	getAllWithFilters,
	updatewriting,
} = require('../services/writing.service.js');

class WritingController {
	create = async (req, res, next) => {
		console.log('data req writing:', req.body);

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: await createWriting(req.body),
		}).send(res);
	};

	getAllWithQuery = async (req, res, next) => {
		const params = req.query;

		const filter = JSON.parse(params.filter);

		const range = JSON.parse(params.range);

		const sort = JSON.parse(params.sort);

		new SuccessResponse({
			message: 'creat new writing success!',
			metadata: await getAllWithQuery({ filter, range, sort }),
		}).send(res);
	};
	getOneById = async (req, res, next) => {
		const { id } = req.params;

		console.log('id:', id);

		new SuccessResponse({
			message: 'creat new writing success!',
			metadata: await getOneById(id),
		}).send(res);
	};

	updateOneById = async (req, res, next) => {
		const { id } = req.params;
		const data = req.body;


		new SuccessResponse({
			message: 'update new writing success!',
			metadata: await updatewriting(id, data),
		}).send(res);
	};

	getAllWithFilters = async (req, res, next) => {
		console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new writing success!',
			metadata: await getAllWithFilters(req.body),
		}).send(res);
	};
	// //QUERY//

	getAllTopic = async (req, res, next) => {
		// console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: await getAllTopc(),
		}).send(res);
	};
	//END QUERY
}

module.exports = new WritingController();
