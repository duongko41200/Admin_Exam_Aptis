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
				default: [],
			},
			part2: {
				type: [Number],
				required: true,
				default: [],
			},
			part3: {
				type: [Number],
				required: true,
				default: [],
			},
			part4: {
				type: [Number],
				required: true,
				default: [],
			},
			part5: {
				type: [Number],
				required: true,
				default: [],
			},
		},
		listening: {
			part1: {
				type: [Number],
				required: true,
				default: [],
			},
			part2: {
				type: [Number],
				required: true,
				default: [],
			},
			part3: {
				type: [Number],
				required: true,
				default: [],
			},
			part4: {
				type: [Number],
				required: true,
				default: [],
			},
			part5: {
				type: [Number],
				required: true,
				default: [],
			},
		},
		reading: {
			part1: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
				default: [],
			},
			part2: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
				default: [],
			},
			part3: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
				default: [],
			},
			part4: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
				default: [],
			},
			part5: {
				type: [Schema.Types.ObjectId],
				ref: 'Reading',
				required: true,
				default: [],
			},
		},
		writing: {
			part1: {
				type: [Number],
				required: true,
				default: [],
			},
			part2: {
				type: [Number],
				required: true,
				default: [],
			},
			part3: {
				type: [Number],
				required: true,
				default: [],
			},
			part4: {
				type: [Number],
				required: true,
				default: [],
			},
			part5: {
				type: [Number],
				required: true,
				default: [],
			},
		},
	},
	{
		timestamps: true,
		collection: 'testBanks',
	}
);

// Xuất ReadingSchema và TestBankSchema

module.exports = mongoose.model('TestBank', testBankSchema);;
