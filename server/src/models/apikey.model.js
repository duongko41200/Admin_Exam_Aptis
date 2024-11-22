'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

const apiKeySchema = new Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
		permissions: {
			type: [String],
			required: true,
			enum: ['000', '111', '222'],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

export default model(DOCUMENT_NAME, apiKeySchema);
