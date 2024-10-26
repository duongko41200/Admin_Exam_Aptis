'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
var keyTokenSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		privateKey: {
			type: String,
			required: true,
		},
		publicKey: {
			type: String,
			required: true,
		},
		refreshTokensUsed: {
			type: Array,
			default: [String], // nhuwngx RT da duoc su dung
		},
		refreshToken: {
			type: String,
			require:true
		}
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
