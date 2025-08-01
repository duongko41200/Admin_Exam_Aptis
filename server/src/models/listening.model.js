import mongoose from "mongoose";
const Schema = mongoose.Schema;

// SubQuestion Schema for each sub-question



const COLLECTION_NAME = "Listenings";

const SubQuestionSchema = new Schema({
  content: { type: String, required: true },
  correctAnswer: { type: String, default: "" },
  file: { type: String, default: null },
  answerList: { type: Array, default: [] },
  image: { type: String, default: null },
  suggestion: { type: String, default: "" },
});

// Question Schema for each main question
const QuestionSchema = new Schema({
  questionTitle: { type: String, required: true, default: "" },
  content: { type: String, default: "" },
  answerList: { type: Array, default: [] },
  correctAnswer: { type: String, default: "" },
  file: { type: String, default: "" },
  subQuestionAnswerList: { type: Array, default: [] },
  suggestion: { type: String, default: "" },
  subQuestion: { type: [SubQuestionSchema], default: [] },
  isExample: { type: String, default: "" },
  image: { type: Array, default: [] },
});

// Main schema for the challenge
const ListeningSchema = new Schema(
  {
	id: {
	  type: Schema.Types.ObjectId,
	  default: () => new mongoose.Types.ObjectId(),
	},
	title: { type: String, required: true, default: "" },
	timeToDo: { type: Date, default: null },
	description: { type: String, default: "" },
	questions: { type: [QuestionSchema], default: [] },
	questionPart: { type: String, default: null },
	questionType: { type: String, default: "LISTENING" },
  },
  {
	timestamps: true,
	collection: COLLECTION_NAME,
  }
);

const ListeningModel = mongoose.model("Listening", ListeningSchema);

export default ListeningModel;
