'use strict';

//!mdbgum: create model partent

const { model, Schema, Types } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'TextStructure';
const COLLECTION_NAME = 'TextStructures';
const textFormSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		defind: {
			type: String,
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		topicId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Topic',
		},
		typeText: {
			type: String,
			required: true,
		},
		repeat: {
			type: Number,
			default: 1,
		},
		isRemind: {
			type: Boolean,
			default: true,
		},
		dayReview: {
			type: String,
			default: '', // default sẽ là ngày hôm sau
		},
		attributes: {
			type: Schema.Types.Mixed,
			// required: true,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

// Declare the Schema of the Mongo model
const wordSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		spelling: {
			type: String,
			default: '',
		},
		audio: {
			type: String,
			default: '',
		},
		advan_translation: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
		collection: 'Words',
	}
);
const sentenceSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		structure: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
		collection: 'Sentences',
	}
);

//Export the model
module.exports = {
	text: model(DOCUMENT_NAME, textFormSchema),
	word: model('Words', wordSchema),
	sentence: model('Sentences', sentenceSchema),
};
