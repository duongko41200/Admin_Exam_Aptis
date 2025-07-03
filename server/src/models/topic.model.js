'use strict';

import { model, Schema } from 'mongoose';

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Topic';
const COLLECTION_NAME = 'Topics';
const topicSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
		},
		isPublic: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

// Export the model
export default model(DOCUMENT_NAME, topicSchema);
