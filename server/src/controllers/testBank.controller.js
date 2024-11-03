'use strict';

const { SuccessResponse } = require('../cores/success.response.js');

const {
	createTestBank,
	getAllWithQuery,
	getOneById,
	getAllWithFilters,
	getAll
} = require('../services/testBank.service.js');

class TestBankController {
	create = async (req, res, next) => {
		console.log('test data', req.body);

		new SuccessResponse({
			message: 'creat new bo de success!',
			metadata: await createTestBank(req.body),
		}).send(res);
	};

	getAllWithQuery = async (req, res, next) => {
		const params = req.query;

		const filter = JSON.parse(params.filter);

		const range = JSON.parse(params.range);

		const sort = JSON.parse(params.sort);

		new SuccessResponse({
			message: 'creat new BO DE success!',
			metadata: await getAllWithQuery({ filter, range, sort }),
		}).send(res);
	};

	getAllWithFilters = async (req, res, next) => {
		console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await getAllWithFilters(req.body),
		}).send(res);
	};

	getAll = async (req, res, next) => {
		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await getAll(),
		}).send(res);
	};
	// //QUERY//

	//END QUERY
}

module.exports = new TestBankController();
