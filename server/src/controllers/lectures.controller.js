'use strict';

import { SuccessResponse } from '../cores/success.response.js';
import LecturesFactory from '../services/lectures.service.js';

class LecturesController {
	create = async (req, res, next) => {
		console.log('test data', req.body);

		new SuccessResponse({
			message: 'creat new bo de success!',
			metadata: await LecturesFactory.createTestBank(req.body),
		}).send(res);
	};
	getOneById = async (req, res, next) => {
		const { id } = req.params;

		console.log('id:', id);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await LecturesFactory.getOneById(id),
		}).send(res);
	};
	updateOneById = async (req, res, next) => {
		const { id } = req.params;
		const data = req.body;

		console.log('data:', data);

		new SuccessResponse({
			message: 'update new Reading success!',
			metadata: await LecturesFactory.updateOneById(id, data),
		}).send(res);
	};

	getAllWithQuery = async (req, res, next) => {
		const params = req.query;

		const filter = JSON.parse(params.filter);

		const range = JSON.parse(params.range);

		const sort = JSON.parse(params.sort);

		new SuccessResponse({
			message: 'creat new BO DE success!',
			metadata: await LecturesFactory.getAllWithQuery({
				filter,
				range,
				sort,
			}),
		}).send(res);
	};

	getAllWithFilters = async (req, res, next) => {
		console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await LecturesFactory.getAllWithFilters(req.body),
		}).send(res);
	};

	getAll = async (req, res, next) => {
		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await LecturesFactory.getAll(),
		}).send(res);
	};
	// //QUERY//
	deleteById = async (req, res, next) => {
		console.log(' data req:', req.params);

		new SuccessResponse({
			message: 'delete record success!',
			metadata: await LecturesFactory.deleteTestBankById({
				_id: req.params.id,
			}),
		}).send(res);
	};
	//END QUERY
		getAllWithFiltersCourseType = async (req, res, next) => { 
			const { courseType } = req.params;
	
			console.log('courseType:', courseType);
	
			new SuccessResponse({
				message: 'creat new Reading success!',
				metadata: await LecturesFactory.getAllWithFiltersCourseType(courseType),
			}).send(res);
		}
}

export default new LecturesController();
