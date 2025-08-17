import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numberQuestion: 1,
  numberQuestionEachPart: 1,
  urlFile: "",
  currentListeningData: {
    title: "",
    subTitle: "",
    content: "",
    suggestion: "",
    file: "",
    answerList: [], // Add answerList for storing main answer options
    subQuestions: [],
  },
};

export const listeningReducer = createSlice({
  name: "ListeningStore",
  initialState,
  reducers: {
    SET_INCREMENT_LISTENING: (state) => {
      state.numberQuestion += 1;
    },
    SET_DECREMENT_LISTENING: (state) => {
      state.numberQuestion -= 1;
    },

    SET_INCREMENT_LISTENING_EACH_PART: (state) => {
      state.numberQuestionEachPart += 1;
    },
    SET_DECREMENT_LISTENING_EACH_PART: (state) => {
      state.numberQuestionEachPart -= 1;
    },
    SET_RESET_NUMBER_QUESTION_LISTENING: (state) => {
      state.numberQuestionEachPart = 1;
    },
    SET_NUMBER_QUESTION_LISTENING: (state, action) => {
      let numberQuestionPart = action.payload.numberQuestionPart;

      const numberQuestion = action.payload.numberQuestion.question;

      if (numberQuestion === 2) {
        numberQuestionPart = 13;
      }
      if (numberQuestion === 3) {
        numberQuestionPart = 14;
      }
      if (numberQuestion === 4) {
        numberQuestionPart = 15 + numberQuestionPart;
      }

      state.numberQuestion = numberQuestion;

      state.numberQuestionEachPart = numberQuestionPart + 1;
    },
    SET_URL_FILE: (state, action) => {
      state.urlFile = action.payload;
    },

    // Actions for updating current listening data
    UPDATE_LISTENING_MAIN_DATA: (state, action) => {
      const { field, value } = action.payload;
      state.currentListeningData[field] = value;
    },

    UPDATE_LISTENING_SUB_QUESTION: (state, action) => {
      const { index, field, value } = action.payload;
      // Không tự động thêm phần tử mới, chỉ update nếu index đã tồn tại
      if (state.currentListeningData.subQuestions[index]) {
        state.currentListeningData.subQuestions[index][field] = value;
      }
    },

    UPDATE_LISTENING_SUB_QUESTION_SUGGESTION: (state, action) => {
      const { index, value } = action.payload;
      // Không tự động thêm phần tử mới, chỉ update nếu index đã tồn tại
      if (state.currentListeningData.subQuestions[index]) {
        state.currentListeningData.subQuestions[index].suggestion = value;
      }
    },

    RESET_LISTENING_DATA: (state) => {
      state.currentListeningData = {
        title: "",
        subTitle: "",
        content: "",
        suggestion: "",
        file: "",
        answerList: [],
        subQuestions: [],
      };
    }, // Khởi tạo subQuestions với số lượng cụ thể
    INIT_LISTENING_SUB_QUESTIONS: (state, action) => {
      const { count } = action.payload;
      state.currentListeningData.subQuestions = Array.from(
        { length: count },
        () => ({
          content: "",
          correctAnswer: "",
          file: "",
          answerList: [{ content: "" }, { content: "" }, { content: "" }],
          image: null,
          suggestion: "",
        })
      );
    },

    //Actiona
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_INCREMENT_LISTENING,
  SET_DECREMENT_LISTENING,
  SET_INCREMENT_LISTENING_EACH_PART,
  SET_DECREMENT_LISTENING_EACH_PART,
  SET_RESET_NUMBER_QUESTION_LISTENING,
  SET_NUMBER_QUESTION_LISTENING,
  SET_URL_FILE,
  UPDATE_LISTENING_MAIN_DATA,
  UPDATE_LISTENING_SUB_QUESTION,
  UPDATE_LISTENING_SUB_QUESTION_SUGGESTION,
  RESET_LISTENING_DATA,
  INIT_LISTENING_SUB_QUESTIONS,
} = listeningReducer.actions;

export default listeningReducer.reducer;
