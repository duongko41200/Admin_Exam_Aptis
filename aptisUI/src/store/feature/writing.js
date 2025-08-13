import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numberQuestion: 1,
  numberQuestionEachPart: 1,
  subQuestionWriting: [],
  currentWritingData: {
    title: "",
    subTitle: "",
    content: "",
    suggestion: "",
    file: "",
    subQuestions: [],
  },
};

export const writingReducer = createSlice({
  name: "WritingStore",
  initialState,
  reducers: {
    SET_INCREMENT_WRITING: (state) => {
      state.numberQuestion += 1;
    },
    SET_DECREMENT_WRITING: (state) => {
      state.numberQuestion -= 1;
    },
    SET_NUMBER_QUESTION_WRITING: (state, action) => {
      state.numberQuestion = action.payload;
    },

    SET_INCREMENT_WRITING_EACH_PART: (state) => {
      if (
        state.numberQuestionEachPart <
        state.currentWritingData.subQuestions.length
      ) {
        state.numberQuestionEachPart += 1;
      }
    },
    SET_DECREMENT_WRITING_EACH_PART: (state) => {
      if (state.numberQuestionEachPart > 1) {
        state.numberQuestionEachPart -= 1;
      }
    },
    SET_RESET_NUMBER_QUESTION_WRITING: (state) => {
      state.numberQuestionEachPart = 1;
    },

    SET_SUB_QUESTION_WRITING: (state, action) => {
      state.subQuestionWriting = action.payload;
    },

    // Actions for updating current writing data
    UPDATE_WRITING_MAIN_DATA: (state, action) => {
      const { field, value } = action.payload;
      state.currentWritingData[field] = value;
    },

    UPDATE_WRITING_SUB_QUESTION: (state, action) => {
      const { index, field, value } = action.payload;
      // Không tự động thêm phần tử mới, chỉ update nếu index đã tồn tại
      if (state.currentWritingData.subQuestions[index]) {
        state.currentWritingData.subQuestions[index][field] = value;
      }
    },

    UPDATE_WRITING_SUB_QUESTION_SUGGESTION: (state, action) => {
      const { index, value } = action.payload;
      // Không tự động thêm phần tử mới, chỉ update nếu index đã tồn tại
      if (state.currentWritingData.subQuestions[index]) {
        state.currentWritingData.subQuestions[index].suggestion = value;
      }
    },

    RESET_WRITING_DATA: (state) => {
      state.currentWritingData = {
        title: "",
        subTitle: "",
        content: "",
        suggestion: "",
        file: "",
        subQuestions: [],
      };
    },

    // Khởi tạo subQuestions với số lượng cụ thể
    INIT_SUB_QUESTIONS: (state, action) => {
      const { count } = action.payload;
      state.currentWritingData.subQuestions = Array.from(
        { length: count },
        () => ({
          content: "",
          correctAnswer: null,
          file: "",
          answerList: null,
          image: null,
          suggestion: "",
        })
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_INCREMENT_WRITING,
  SET_DECREMENT_WRITING,
  SET_NUMBER_QUESTION_WRITING,
  SET_INCREMENT_WRITING_EACH_PART,
  SET_DECREMENT_WRITING_EACH_PART,
  SET_RESET_NUMBER_QUESTION_WRITING,
  SET_SUB_QUESTION_WRITING,
  UPDATE_WRITING_MAIN_DATA,
  UPDATE_WRITING_SUB_QUESTION,
  UPDATE_WRITING_SUB_QUESTION_SUGGESTION,
  RESET_WRITING_DATA,
  INIT_SUB_QUESTIONS,
} = writingReducer.actions;

export default writingReducer.reducer;
