'use strict';

import { SuccessResponse } from '../cores/success.response.js';
import CourseFactory from '../services/course.service.js';

class CourseController {
	create = async (req, res, next) => {
		console.log('test data', req.body);

		new SuccessResponse({
			message: 'creat new bo de success!',
			metadata: await CourseFactory.createTestBank(req.body),
		}).send(res);
	};
	getOneById = async (req, res, next) => {
		const { id } = req.params;

		console.log('id:', id);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await CourseFactory.getOneById(id),
		}).send(res);
	};
	getAllWithFiltersCourseType = async (req, res, next) => { 
		const { courseType } = req.params;

		console.log('courseType:', courseType);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await CourseFactory.getAllWithFiltersCourseType(courseType),
		}).send(res);
	}
	updateOneById = async (req, res, next) => {
		const { id } = req.params;
		const data = req.body;

		console.log("data:", data);

		new SuccessResponse({
			message: 'update new Reading success!',
			metadata: await CourseFactory.updateOneById(id, data),
		}).send(res);
	};

	getAllWithQuery = async (req, res, next) => {
		const params = req.query;

		const filter = JSON.parse(params.filter);

		const range = JSON.parse(params.range);

		const sort = JSON.parse(params.sort);

		new SuccessResponse({
			message: 'creat new BO DE success!',
			metadata: await CourseFactory.getAllWithQuery({ filter, range, sort }),
		}).send(res);
	};

	getAllWithFilters = async (req, res, next) => {
		console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await CourseFactory.getAllWithFilters(req.body),
		}).send(res);
	};

	getAll = async (req, res, next) => {
		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await CourseFactory.getAll(),
		}).send(res);
	};
	deleteOneById = async (req, res, next) => {
		const { id } = req.params;

		new SuccessResponse({
			message: 'delete new Reading success!',
			metadata: await CourseFactory.deleteTestBankById(id),
		}).send(res);
	};
	// //QUERY//

	//END QUERY
}

export default new CourseController();
