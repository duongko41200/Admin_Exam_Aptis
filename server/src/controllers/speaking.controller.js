'use strict';

import { SuccessResponse } from '../cores/success.response.js';
import {
	createTopic,
	getAllTopc,
} from '../models/respositories/text.repo.js';
import WritingFactory from '../services/writing.service.js';
import { v2 as cloudinary } from 'cloudinary';

class speakingController {
	create = async (req, res, next) => {
		// Thiết lập thông tin Cloudinary
		cloudinary.config({
			cloud_name: 'dys0lk3ly',
			api_key: '487986324139414',
			api_secret: 'cvMGKbZ45JucH0fZs7SBo44DDzI',
		});

		console.log('foe;', req.file);

		if (!req.file) {
			return res.status(400).send('No file uploaded');
		}

		// Upload ảnh lên Cloudinary

		// Upload an image
		const uploadResult = await cloudinary.uploader
			.upload(
				req.file,
				{
					public_id: 'shoes',
				}
			)
			.catch((error) => {
				console.log(error);
			});

		console.log(uploadResult);

		// Optimize delivery by resizing and applying auto-format and auto-quality
		const optimizeUrl = cloudinary.url('shoes', {
			fetch_format: 'auto',
			quality: 'auto',
		});

		console.log(optimizeUrl);

		// Transform the image: auto-crop to square aspect_ratio
		const autoCropUrl = cloudinary.url('shoes', {
			crop: 'auto',
			gravity: 'auto',
			width: 500,
			height: 500,
		});

		console.log({autoCropUrl});

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: 'thanh codng',
		}).send(res);
	};

	getAllWithQuery = async (req, res, next) => {
		const params = req.query;

		const filter = JSON.parse(params.filter);

		const range = JSON.parse(params.range);

		const sort = JSON.parse(params.sort);

		new SuccessResponse({
			message: 'creat new writing success!',
			metadata: await WritingFactory.getAllWithQuery({
				filter,
				range,
				sort,
			}),
		}).send(res);
	};
	getOneById = async (req, res, next) => {
		const { id } = req.params;

		console.log('id:', id);

		new SuccessResponse({
			message: 'creat new writing success!',
			metadata: await WritingFactory.getOneById(id),
		}).send(res);
	};

	updateOneById = async (req, res, next) => {
		const { id } = req.params;
		const data = req.body;

		new SuccessResponse({
			message: 'update new writing success!',
			metadata: await WritingFactory.updatewriting(id, data),
		}).send(res);
	};

	getAllWithFilters = async (req, res, next) => {
		console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new writing success!',
			metadata: await WritingFactory.getAllWithFilters(req.body),
		}).send(res);
	};
	// //QUERY//

	getAllTopic = async (req, res, next) => {
		// console.log('data req:', req.body);

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: await WritingFactory.getAllTopc(),
		}).send(res);
	};
	//END QUERY
}

export default new speakingController();
