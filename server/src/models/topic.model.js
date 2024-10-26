'use strict';


//!mdbgum: create model partent

const { model, Schema, Types } = require('mongoose'); // Erase if already required

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




//Export the model
module.exports =  model(DOCUMENT_NAME, topicSchema)

