'use strict';

//!mdbgum: create model partent

const { model, Schema, Types } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';
const userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			maxLength: 150,
		},
		email: {
			type: String,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: '',
		},
		idTelegram: {
			type: String,
			default: '',
		},
		level: {
			type: Number,
			default: 1,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'inactive',
		},
		verfify: {
			type: Schema.Types.Boolean,

			default: false,
		},
		//ngày hết hạn
		roles: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
