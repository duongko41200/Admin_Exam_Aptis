'use strict';

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
const keyTokenSchema = new Schema(
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
			require: true
		}
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

// Export the model
export default model(DOCUMENT_NAME, keyTokenSchema);
