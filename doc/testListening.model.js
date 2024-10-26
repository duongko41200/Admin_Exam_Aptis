const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho câu hỏi nghe
const ListeningQuestionSchema = new Schema({
  id: { type: Number, required: true },
  questionTitle: { type: String, required: true },
  content: { type: String, required: true },
  answerList: [
    { type: Schema.Types.ObjectId, ref: 'AnswerChoice' }, // Lưu trữ mảng các lựa chọn trả lời
  ],
  correctAnswer: { type: Schema.Types.ObjectId, ref: 'AnswerChoice' },
  file: { type: String, required: true }, // Đường dẫn đến file audio
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
  questionType: { type: String, required: true }, // Loại câu hỏi (LISTENING)
  isExample: { type: Boolean, default: false },
  questionPart: { type: String },
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
const ListeningQuestion = mongoose.model(
  'ListeningQuestion',
  ListeningQuestionSchema
);
const AnswerChoice = mongoose.model('AnswerChoice', AnswerChoiceSchema);
const SubQuestion = mongoose.model('SubQuestion', SubQuestionSchema);
const SubQuestionAnswer = mongoose.model(
  'SubQuestionAnswer',
  SubQuestionAnswerSchema
);

// Xuất model để sử dụng trong các file khác
module.exports = {
  ListeningQuestion,
  AnswerChoice,
  SubQuestion,
  SubQuestionAnswer,
};







//// MOt thiet ke khacs



// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Schema cho câu hỏi nghe (đơn giản hóa)
// const ListeningQuestionSchema = new Schema({
//   id: { type: Number, required: true },
//   questionTitle: { type: String, required: true },
//   content: { type: String, required: true },
//   answerList: [{ type: String, required: true }], // Chứa các lựa chọn trả lời dưới dạng mảng chuỗi
//   correctAnswer: { type: String, required: true }, // Trả lời đúng là một chuỗi (content của AnswerChoice)
//   file: { type: String, required: true }, // Đường dẫn đến file audio
//   subQuestions: [
//     {
//       content: { type: String, required: true },
//       correctAnswer: { type: String }, // Có thể là text hoặc một lựa chọn trả lời
//       answerList: [{ type: String, required: true }], // Lựa chọn trả lời dưới dạng mảng chuỗi
//     }
//   ],
//   suggestion: { type: String },
//   image: { type: String }, // Đường dẫn đến hình ảnh (nếu có)
//   questionType: { type: String, required: true }, // Loại câu hỏi (LISTENING)
//   isExample: { type: Boolean, default: false },
//   questionPart: { type: String },
// });

// // Schema cho lựa chọn trả lời (đơn giản hóa)
// const AnswerChoiceSchema = new Schema({
//   id: { type: String, required: true }, // UUID hoặc ID duy nhất cho mỗi lựa chọn
//   content: { type: String, required: true }, // Nội dung của lựa chọn trả lời
// });

// // Tạo model từ schema
// const ListeningQuestion = mongoose.model('ListeningQuestion', ListeningQuestionSchema);
// const AnswerChoice = mongoose.model('AnswerChoice', AnswerChoiceSchema);

// // Xuất model để sử dụng trong các file khác
// module.exports = {
//   ListeningQuestion,
//   AnswerChoice,
// };
