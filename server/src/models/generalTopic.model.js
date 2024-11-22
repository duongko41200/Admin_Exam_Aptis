'use strict';

import mongoose from 'mongoose';

const { model, Schema, Types } = mongoose;

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'GeneralTopic';
const COLLECTION_NAME = 'GeneralTopics';
const generalTopicSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		TopicId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Topic',
		},
		total: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

// Export the model
export default model(DOCUMENT_NAME, generalTopicSchema);
