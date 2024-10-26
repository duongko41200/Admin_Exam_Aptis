import ApiService from './api.service';

const serviceURL = 'text';
const TextService = {
	//suy nghĩ xem gộp api của câu vào không
	createWord({ text, defind, topicId, typeText, attributes }) {
		return ApiService.post(
			`${serviceURL}/info/all`,
			{
				text: text,
				defind: defind,
				topicId: topicId,
				typeText: typeText,
				attributes: attributes,
			},
			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			}
		);
	},
	getAllText({ page, limit }) {
		return ApiService.get(
			`${serviceURL}/all`,

			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			},
			{
				page: page,
				limit,
			}
		);
	},

	getListTextByFilter({ page, limit, level, typeText, date }) {
		return ApiService.get(
			`${serviceURL}/review`,

			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			},
			{
				page,
				limit,
				level,
				typeText,
				date,
			}
		);
	},
	deleteText({ page, limit, level, typeText, date, textId }) {
		return ApiService.delete(
			`${serviceURL}/delete`,

			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			},
			{
				page,
				limit,
				level,
				typeText,
				date,
				textId,
			}
		);
	},

	patchText({ textId, text, defind, typeText, attributes, topicId }) {
		return ApiService.patch(
			`${serviceURL}/update-id`,
			{
				textId,
				text,
				defind,
				typeText,
				attributes,
				topicId,
			},

			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			}
		);
	},

	getListPendding() {
		return ApiService.get(
			`${serviceURL}/listPending`,

			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			},
			{}
		);
	},

	updateLevelText({ textId, repeat, dayReview }) {
		return ApiService.patch(
			`${serviceURL}/update-level`,
			{ textId, repeat, dayReview },

			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			}
		);
	},
	getAll({ userId, accessToken }) {
		return ApiService.get(
			`${serviceURL}/all-text`,

			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': userId,
				authorization: accessToken,
			},
			{}
		);
	},
};

export default TextService;
