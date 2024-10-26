'use strict';

const apikeyModel = require('../models/apikey.model');
const crypto = require('node:crypto');

const findbyId = async (key) => {
	// const objKey = await apikeyModel
	// 	.create({
	// 		key: crypto.randomBytes(64).toString('hex'),
	// 		permissions: ['000'],
	// 	})

	// console.log({objKey})
	const objKey = await apikeyModel
		.findOne({ key, status: true })
		.lean();
	return objKey;
};

module.exports = {
	findbyId,
};
