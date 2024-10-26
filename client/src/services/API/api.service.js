import axiosBase from 'axios';

const apiUrl = '/v1/api';

const axios = axiosBase.create({
	// This is development host
	baseURL: import.meta.env.APP_BASE_URL,
	timeout: 10000,
	// headers: {
	// 	'x-api-key': process.env.VUE_APP_API_KEY,
	// 	'x-client-id': window.sessionStorage.getItem('userId'),
	// 	authorization: window.sessionStorage.getItem('accessToken'),
	// },
});

axios.defaults.headers = {
	'Cache-Control': 'no-cache',
	Pragma: 'no-cache',
	Expires: '0',
};

// axios.interceptors.request.use(
// 	function (config) {
// 		store.commit('setIsShowSpinner', true);
// 		// Do something before request is sent
// 		return config;
// 	},
// 	function (error) {
// 		store.commit('setIsShowSpinner', false);

// 		// Do something with request error
// 		return Promise.reject(error);
// 	}
// );

// // Add a response interceptor
// axios.interceptors.response.use(
// 	function (response) {
// 		// Do something with response data
// 		store.commit('setIsShowSpinner', false);

// 		return response;
// 	},
// 	function (error) {
// 		// Do something with response error
// 		store.commit('setIsShowSpinner', false);

// 		return Promise.reject(error);
// 	}
// );

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
const responseCallback = (res) => {
	return [res.data, undefined];
};
const ApiService = {
	query(resource, params, headers) {
		return axios
			.get(
				`${apiUrl}/${resource}`,
				{ params: params },
				{
					headers: headers,
				}
			)
			.then(responseCallback)
			.catch(catchError);
	},
	get(resource, headers, queryParams) {
		return axios
			.get(`${apiUrl}/${resource}`, {
				headers: headers,
				params: queryParams,
			})
			.then(responseCallback)
			.catch(catchError);
	},
	post(resource, body, headers) {
		return axios
			.post(`${apiUrl}/${resource}`, body, {
				headers: headers,
			})
			.then(responseCallback)
			.catch(catchError);
	},
	patch(resource, body, headers) {
		return axios
			.patch(`${apiUrl}/${resource}`, body, {
				headers: headers,
			})
			.then(responseCallback)
			.catch(catchError);
	},
	delete(resource, headers,queryParams) {
		return axios
			.delete(`${apiUrl}/${resource}`, {
				headers: headers,
				params: queryParams,
			})
			.then(responseCallback)
			.catch(catchError);
	},
	// deleteBulk(resource, body, headers) {
	// 	return axios
	// 		.delete(`${apiUrl}/${resource}`, { data: body })
	// 		.then(responseCallback)
	// 		.catch(catchError);
	// },
};

export default ApiService;
