const mongoose = require('mongoose');

const COLLECTION_NAME = 'Writings';

const subQuestionSchema = new mongoose.Schema({
	content: { type: String, default: null },
	correctAnswer: { type: String, default: null },
	file: { type: String, default: null },
	answerList: { type: [String], default: [] },
	image: { type: String, default: null },
	suggestion: { type: String, default: null },
});

const questionSchema = new mongoose.Schema({
	questionTitle: { type: String, required: true },
	content: { type: String, required: true },
	answerList: { type: [String], default: [] },
	correctAnswer: { type: String, default: null },
	file: { type: String, default: null },
	subQuestionAnswerList: { type: [String], default: [] },
	suggestion: { type: String, default: null },
	subQuestion: { type: [subQuestionSchema], default: [] },
	questionType: { type: String, default: 'WRITING' },
	isExample: { type: Boolean, default: false },
	questionPart: { type: String, required: true },
	image: { type: String, default: null },
});

const writingSchema = new mongoose.Schema({
	title: { type: String, default: null },
	timeToDo: { type: Number, default: null },
	questions: { type: [questionSchema], default: [] },
	skill: { type: String, default: null },
	description: { type: String, default: null },
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

module.exports = mongoose.model('Writing', writingSchema);
