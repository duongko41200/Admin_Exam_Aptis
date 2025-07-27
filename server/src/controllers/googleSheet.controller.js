'use strict';

import { SuccessResponse } from '../cores/success.response.js';
import GoogleSheetFactory from '../services/googleSheet.service.js';

class GoogleSheetController {
	create = async (req, res, next) => {
		console.log('test data', req.body);

		new SuccessResponse({
			message: 'creat new bo de success!',
			metadata: await GoogleSheetFactory.createProcessLearn(req.body),
		}).send(res);
	};
	
}

export default new GoogleSheetController();
