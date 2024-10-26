'use strict';

const { SuccessResponse } = require('../cores/success.response.js');
const {
	createTopic,
	getAllTopc,
} = require('../models/respositories/text.repo.js');

class TopicController {
	createTopic = async (req, res, next) => {
		console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: await createTopic({
				name: req.body.name,
				userId: req.user.userId,
			}),
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

module.exports = new TopicController();
