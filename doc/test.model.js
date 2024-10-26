const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho bài tập đọc hiểu
const ReadingExerciseSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  timeToDo: { type: Number, required: true },
  skill: { type: String, default: 'READING' },
  description: { type: String },
  questions: [
    { type: Schema.Types.ObjectId, ref: 'Question' }, // Lưu trữ mảng các câu hỏi liên quan
  ],
});

// Schema cho câu hỏi
const QuestionSchema = new Schema({
  id: { type: Number, required: true },
  readingExerciseId: { type: Number, required: true },
  questionTitle: { type: String, required: true },
  content: { type: String, required: true },
  questionType: { type: String, required: true },
  isExample: { type: Boolean, default: false },
  questionPart: { type: String },
  answerList: [
    { type: Schema.Types.ObjectId, ref: 'AnswerChoice' }, // Lưu trữ mảng các lựa chọn trả lời
  ],
  correctAnswer: { type: Schema.Types.ObjectId, ref: 'AnswerChoice' },
  file: { type: String }, // Đường dẫn đến file liên quan (nếu có)
  subQuestionAnswerList: [
    { type: Schema.Types.ObjectId, ref: 'SubQuestionAnswer' },
  ],
  suggestion: { type: String },
  subQuestion: [
    {
      content: { type: String, required: true },
      correctAnswer: { type: String }, // Có thể là text hoặc id của AnswerChoice nếu có
      answerList: [{ type: Schema.Types.ObjectId, ref: 'AnswerChoice' }],
      subQuestionAnswerList: [
        { type: Schema.Types.ObjectId, ref: 'SubQuestionAnswer' },
      ],
    },
  ],
  image: { type: String }, // Đường dẫn đến hình ảnh liên quan (nếu có)
});

// Schema cho lựa chọn trả lời
const AnswerChoiceSchema = new Schema({
  id: { type: String, required: true }, // Sử dụng UUID để đảm bảo tính duy nhất
  questionId: { type: Number, required: true },
  content: { type: String, required: true },
});

// Schema cho câu hỏi phụ
const SubQuestionSchema = new Schema({
  id: { type: Number, required: true },
  questionId: { type: Number, required: true },
  content: { type: String, required: true },
  correctAnswer: { type: String }, // Có thể là text hoặc id của AnswerChoice nếu có
  answerList: [{ type: Schema.Types.ObjectId, ref: 'AnswerChoice' }],
  subQuestionAnswerList: [
    { type: Schema.Types.ObjectId, ref: 'SubQuestionAnswer' },
  ],
});

// Schema cho câu trả lời của câu hỏi phụ
const SubQuestionAnswerSchema = new Schema({
  subQuestionId: { type: Number, required: true },
  answerChoiceId: { type: String, required: true }, // Sử dụng UUID để đảm bảo tính duy nhất
});

// Tạo model từ schema
const ReadingExercise = mongoose.model(
  'ReadingExercise',
  ReadingExerciseSchema
);
const Question = mongoose.model('Question', QuestionSchema);
const AnswerChoice = mongoose.model('AnswerChoice', AnswerChoiceSchema);
const SubQuestion = mongoose.model('SubQuestion', SubQuestionSchema);
const SubQuestionAnswer = mongoose.model(
  'SubQuestionAnswer',
  SubQuestionAnswerSchema
);

// Xuất model để sử dụng trong các file khác
module.exports = {
  ReadingExercise,
  Question,
  AnswerChoice,
  SubQuestion,
  SubQuestionAnswer,
};