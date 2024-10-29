const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Định nghĩa ReadingSchema (giả sử bạn đã có schema này)

// Định nghĩa TestBankSchema
const testBankSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		speaking: {
			part1: {
				type: [Number],
				required: true,
			},
			part2: {
				type: [Number],
				required: true,
			},
			part3: {
				type: [Number],
				required: true,
			},
			part4: {
				type: [Number],
				required: true,
			},
		},
		listening: {
			part1: {
				type: String,
				required: true,
			},
			part2: {
				type: String,
				required: true,
			},
			part3: {
				type: String,
				required: true,
			},
		},
		reading: {
			part1: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
			},
			part2: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
			},
			part3: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
			},
			part4: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
			},
		},
		writing: {
			part1: {
				type: String,
				required: true,
			},
			part2: {
				type: String,
				required: true,
			},
			part3: {
				type: String,
				required: true,
			},
			part4: {
				type: String,
				required: true,
			},
		},
	},
	{
		timestamps: true,
		collection: 'testBanks',
	}
);

// Xuất ReadingSchema và TestBankSchema
const TestBank = mongoose.model('TestBank', testBankSchema);

module.exports = { TestBank };
