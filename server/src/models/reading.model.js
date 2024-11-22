import mongoose from 'mongoose';
import TestBank from './testBank.model.js';

const { Schema } = mongoose;

const COLLECTION_NAME = 'Readings';

const SubQuestionSchema = new Schema({
	content: { type: String, required: true },
	correctAnswer: { type: String, required: true },
	file: { type: String, default: null },
	answerList: [
		{
			id: {
				type: Schema.Types.ObjectId,
				default: () => new mongoose.Types.ObjectId(),
			},
			content: { type: String, required: true },
		},
	],
	image: { type: String, default: null },
	suggestion: { type: String, default: null },
});

const QuestionSchema = new Schema({
	id: {
		type: Schema.Types.ObjectId,
		default: () => new mongoose.Types.ObjectId(),
	},
	questionTitle: { type: String, required: true },
	content: { type: String, required: true },
	correctAnswer: { type: Schema.Types.Mixed, required: true },
	file: { type: String, default: null },
	answerList: [
		{
			id: {
				type: Schema.Types.ObjectId,
				default: () => new mongoose.Types.ObjectId(),
			},
			numberOrder: { type: Number || String, default: null},
			content: { type: String, required: true },
		},
	],
	subQuestionAnswerList: [
		{
			id: {
				type: Schema.Types.ObjectId,
				default: () => new mongoose.Types.ObjectId(),
			},
			content: { type: String, required: true },
		},
	],
	suggestion: { type: String, default: null },
	subQuestion: [SubQuestionSchema],
	questionType: { type: String, required: true },
	isExample: { type: Boolean, required: true },
	questionPart: { type: String, required: true },
	image: { type: String, default: null },
});

const ReadingSchema = new Schema(
	{
		data: {
			id: {
				type: Schema.Types.ObjectId,
				default: () => new mongoose.Types.ObjectId(),
			},
			title: { type: String, required: true },
			timeToDo: { type: Number, required: true },
			questions: QuestionSchema,
			skill: { type: String, required: true },
			description: { type: String, default: null },
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

ReadingSchema.pre('remove', async function (next) {
	try {
		await TestBank.deleteMany({
			$or: [
				{ 'reading.part1': this._id },
				{ 'reading.part2': this._id },
				{ 'reading.part3': this._id },
				{ 'reading.part4': this._id },
			],
		});
		next();
	} catch (error) {
		next(error);
	}
});

export default mongoose.model('Reading', ReadingSchema);
