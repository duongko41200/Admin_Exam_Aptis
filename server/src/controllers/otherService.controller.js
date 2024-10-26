'use strict';

const { SuccessResponse } = require('../cores/success.response.js');
const {
	createTopic,
	getAllTopc,
} = require('../models/respositories/text.repo.js');
const axios = require('axios');

class OtherController {
	textToVoice = async (req, res, next) => {
		console.log('data req:', req.query);

		const apiUrl = 'http://api.voicerss.org/';
		const apiKey = 'ac2beaa4f195464cbed9b996bb8abec2';
		const text = req.query.src;
		const language = 'en-us';
		const voice = 'John';
		const rate = '1';

		// Tạo URL cho API VoiceRSS
		const url = `${apiUrl}?key=${apiKey}&hl=${language}&r=${rate}&v=${voice}&src=${encodeURIComponent(
			text
		)}`;

		const data = await axios.get(url, { responseType: 'arraybuffer' });

		const audioData = Buffer.from(data.data, 'binary').toString(
			'base64'
		);
		console.log('data res:', data.data);

		new SuccessResponse({
			message: 'creat new textFrom success!',
			metadata: { voice: audioData },
		}).send(res);
	};
}

module.exports = new OtherController();
