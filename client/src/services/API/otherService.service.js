import axios from 'axios';
import ApiService from './api.service';

const responseCallback = (res) => {
	return [res.data, undefined];
};

const serviceURL = 'other';

const catchError = (error) => {
	console.log(`ApiService: ${error}`);
	if (error.response) {
		// Request made and server responded
		return [undefined, error.response.data];
	} else if (error.request) {
		// The request was made but no response was received
		console.log(error.request);
		return [undefined, error];
	} else {
		// Something happened in setting up the request that triggered an Error
		console.log('Error', error);
		return [undefined, error];
	}
};
const OtherService = {
	//suy nghĩ xem gộp api của câu vào không
	textToVoice(param) {
		return ApiService.get(
			`${serviceURL}/text-to-voice`,
			{
				'x-api-key': import.meta.env.APP_API_KEY,
				'x-client-id': localStorage.getItem('userId'),
				authorization: localStorage.getItem('accessToken'),
			},
			{ ...param }
		);
	},
};

export default OtherService;
