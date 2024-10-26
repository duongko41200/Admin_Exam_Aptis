import ApiService from './api.service';

const serviceURL = 'topic';
const TopicService = {
	getAllTopic() {
		return ApiService.get(
			`${serviceURL}/all`,
			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			},
			{}
		);
	},
};

export default TopicService;
