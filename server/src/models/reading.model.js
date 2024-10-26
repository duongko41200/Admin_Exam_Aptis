const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Readings';

const SubQuestionSchema = new Schema({
	content: { type: String, required: true },
	correctAnswer: { type: String, required: true },
	file: { type: String, default: null },
	answerList: [
		{
			id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
			content: { type: String, required: true },
		},
	],
	image: { type: String, default: null },
	suggestion: { type: String, default: null },
});

const QuestionSchema = new Schema({
	id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
	questionTitle: { type: String, required: true },
	content: { type: String, required: true },
	correctAnswer: { type: Schema.Types.Mixed, required: true },
	file: { type: String, default: null },
	subQuestionAnswerList: [
		{
			id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
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
			id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
			title: { type: String, required: true },
			timeToDo: { type: Number, required: true },
			questions: [QuestionSchema],
			skill: { type: String, required: true },
			description: { type: String, default: null },
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	}
);

module.exports = mongoose.model('Reading', ReadingSchema);
