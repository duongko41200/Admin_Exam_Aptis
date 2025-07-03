'use strict';

import { SuccessResponse } from '../cores/success.response.js';
import { createTopic, getAllTopc } from '../models/respositories/text.repo.js';

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

export default new TopicController();
