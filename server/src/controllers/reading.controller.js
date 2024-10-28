'use strict';

const { SuccessResponse } = require('../cores/success.response.js');
const {
	createTopic,
	getAllTopc,
} = require('../models/respositories/text.repo.js');
const { createReading } = require('../services/reading.service.js');
const {
	getAllWithQuery,
	getOneById,
} = require('../services/reading.service.js');

class ReadingController {
	create = async (req, res, next) => {
		// console.log('data req:', req.body);

		// const data = {
		// 	title: 'Reading 5 - BC',
		// 	timeToDo: 35,
		// 	questions: [
		// 		{
		// 			id: 617,
		// 			questionTitle: 'Reading - Test 5 - Part 1',
		// 			content:
		// 				'<p><strong style="color: rgb(22, 22, 22);">Read the email from Janice to her friend.&nbsp;Choose one word from the list for each gap. The first one is done for you.</strong></p><p><span style="color: rgb(22, 22, 22);">﻿Dear Sally,</span></p> tentisspace <p>Love,</p><p>Janice</p>',
		// 			answerList: [],
		// 			correctAnswer: '',
		// 			file: null,
		// 			subQuestionAnswerList: [],
		// 			suggestion: null,
		// 			subQuestion: [
		// 				{
		// 					content:
		// 						'Tim and I are on holiday in Greece. We have a nice  tentisspace  of the sea from our hotel.',
		// 					correctAnswer: 'view',
		// 					file: null,
		// 					answerList: [],
		// 					image: null,
		// 					suggestion: null,
		// 				},
		// 				{
		// 					content:
		// 						'The weather is  tentisspace  and it’s really hot.',
		// 					correctAnswer: '2dec691c-fc57-4ad9-91b7-794416c97f60',
		// 					file: null,
		// 					answerList: [
		// 						{
		// 							id: '807036fb-3fb0-481b-b295-2a270577730b',
		// 							content: 'large',
		// 						},
		// 						{
		// 							id: '2dec691c-fc57-4ad9-91b7-794416c97f60',
		// 							content: 'great',
		// 						},
		// 						{
		// 							id: '46ffd681-aec6-4680-a52e-9e1d898d607d',
		// 							content: 'big',
		// 						},
		// 					],
		// 					image: null,
		// 					suggestion: null,
		// 				},
		// 				{
		// 					content:
		// 						'Yesterday we went on a  tentisspace  Yesterday we went on a',
		// 					correctAnswer: 'e324edc8-f5da-45ce-befe-81e661a5402e',
		// 					file: null,
		// 					answerList: [
		// 						{
		// 							id: 'e324edc8-f5da-45ce-befe-81e661a5402e',
		// 							content: 'boat',
		// 						},
		// 						{
		// 							id: 'b979f897-8fac-499c-a459-16907bd26d41',
		// 							content: 'train',
		// 						},
		// 						{
		// 							id: 'a52e8665-acee-4198-b11d-f77c40aa0ee8',
		// 							content: 'bus',
		// 						},
		// 					],
		// 					image: null,
		// 					suggestion: null,
		// 				},
		// 				{
		// 					content:
		// 						'We had lunch and then we visited an old   tentisspace',
		// 					correctAnswer: '3db05ac6-31ac-4b0f-bc62-bfcd83f439bb',
		// 					file: null,
		// 					answerList: [
		// 						{
		// 							id: 'a2b71177-c105-49f6-82f5-ccbe3cc9427f',
		// 							content: 'window.',
		// 						},
		// 						{
		// 							id: 'e4d387aa-781d-4b88-beed-f3980926b271',
		// 							content: 'cup.',
		// 						},
		// 						{
		// 							id: '3db05ac6-31ac-4b0f-bc62-bfcd83f439bb',
		// 							content: 'town.',
		// 						},
		// 					],
		// 					image: null,
		// 					suggestion: null,
		// 				},
		// 				{
		// 					content:
		// 						'Tomorrow we are going to take a car and  tentisspace  around.',
		// 					correctAnswer: 'ad68c534-173a-4210-873d-db45c7250d13',
		// 					file: null,
		// 					answerList: [
		// 						{
		// 							id: 'ad68c534-173a-4210-873d-db45c7250d13',
		// 							content: 'drive',
		// 						},
		// 						{
		// 							id: 'b1e81f42-067a-49a4-99de-17a11e2570a1',
		// 							content: 'walk',
		// 						},
		// 						{
		// 							id: '5197ec3b-f85c-49db-904c-5233b2fb90fa',
		// 							content: 'fly',
		// 						},
		// 					],
		// 					image: null,
		// 					suggestion: null,
		// 				},
		// 				{
		// 					content:
		// 						'We are going to visit some  tentisspace  and buy clothes.',
		// 					correctAnswer: '87ff6ac8-1ab1-4ffb-a004-7f1a7b2e57b1',
		// 					file: null,
		// 					answerList: [
		// 						{
		// 							id: 'e02ee23e-b49b-4881-a639-03b9b52fb5a7',
		// 							content: 'books',
		// 						},
		// 						{
		// 							id: '87ff6ac8-1ab1-4ffb-a004-7f1a7b2e57b1',
		// 							content: 'shops',
		// 						},
		// 						{
		// 							id: 'bd9a07a8-206e-4b0e-99d3-ffec0356bbf0',
		// 							content: 'brothers',
		// 						},
		// 					],
		// 					image: null,
		// 					suggestion:
		// 						'<p>1. great 2. boat 3. town 4. drive 5. shops</p>',
		// 				},
		// 			],
		// 			questionType: 'READING',
		// 			isExample: false,
		// 			questionPart: 'ONE',
		// 			image: null,
		// 		},
		// 	],
		// 	skill: 'READING',
		// 	description: null,
		// };

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: await createReading(req.body),
		}).send(res);
	};

	getAllWithQuery = async (req, res, next) => {
		const params = req.query;

		const filter = JSON.parse(params.filter);

		const range = JSON.parse(params.range);

		const sort = JSON.parse(params.sort);

		new SuccessResponse({
			message: 'creat new Reading success!',
			metadata: await getAllWithQuery({ filter, range, sort }),
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

module.exports = new ReadingController();
