import { createSlice } from "@reduxjs/toolkit";
import { SET_NUMBER_OF_SUB_QUESTIONS } from "../taiLieu";

const initialState = {
  numberQuestion: 1,
  numberQuestionEachPart: 1,
  subQuestionSpeaking: [],
  currentSpeakingData: {
    title: "",
    subTitle: "",
    content: "",
    suggestion: "",
    file: "",
    subQuestions: [],
  },
};

export const speakingReducer = createSlice({
  name: "SpeakingStore",
  initialState,
  reducers: {
    SET_INCREMENT_SPEAKING: (state) => {
      state.numberQuestion += 1;
    },
    SET_DECREMENT_SPEAKING: (state) => {
      state.numberQuestion -= 1;
    },

    SET_INCREMENT_SPEAKING_EACH_PART: (state) => {
      if (state.numberQuestionEachPart < state.currentSpeakingData.subQuestions.length) {
        state.numberQuestionEachPart += 1;
      }
    },
    SET_DECREMENT_SPEAKING_EACH_PART: (state) => {
      if (state.numberQuestionEachPart > 1) {
        state.numberQuestionEachPart -= 1;
      }
    },
    SET_RESET_NUMBER_QUESTION_SPEAKING: (state) => {
      state.numberQuestionEachPart = 1;
    },

    SET_NUMBER_OF_QUESTIONS: (state, action) => {
      state.numberQuestion = action.payload;
    },

    SET_SUB_QUESTION_SPEAKING: (state, action) => {
      state.subQuestionSpeaking = action.payload;
    },

    // Actions for updating current speaking data
    UPDATE_SPEAKING_MAIN_DATA: (state, action) => {
      const { field, value } = action.payload;
      state.currentSpeakingData[field] = value;
    },

    UPDATE_SUB_QUESTION: (state, action) => {
      const { index, field, value } = action.payload;
      // Ensure subQuestions array has enough elements
      while (state.currentSpeakingData.subQuestions.length <= index) {
        state.currentSpeakingData.subQuestions.push({
          content: "",
          correctAnswer: null,
          file: "",
          answerList: null,
          image: null,
          suggestion: "",
        });
      }
      state.currentSpeakingData.subQuestions[index][field] = value;
    },

    UPDATE_SUB_QUESTION_SUGGESTION: (state, action) => {
      const { index, value } = action.payload;
      // Ensure subQuestions array has enough elements
      while (state.currentSpeakingData.subQuestions.length <= index) {
        state.currentSpeakingData.subQuestions.push({
          content: "",
          correctAnswer: null,
          file: "",
          answerList: null,
          image: null,
          suggestion: "",
        });
      }
      state.currentSpeakingData.subQuestions[index].suggestion = value;
    },

    RESET_SPEAKING_DATA: (state) => {
      state.currentSpeakingData = {
        title: "",
        subTitle: "",
        content: "",
        suggestion: "",
        file: "",
        subQuestions: [],
      };
    },

    //Actions
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_INCREMENT_SPEAKING,
  SET_DECREMENT_SPEAKING,
  SET_INCREMENT_SPEAKING_EACH_PART,
  SET_DECREMENT_SPEAKING_EACH_PART,
  SET_RESET_NUMBER_QUESTION_SPEAKING,
  SET_NUMBER_OF_QUESTIONS,
  SET_SUB_QUESTION_SPEAKING,
  UPDATE_SPEAKING_MAIN_DATA,
  UPDATE_SUB_QUESTION,
  UPDATE_SUB_QUESTION_SUGGESTION,
  RESET_SPEAKING_DATA,
} = speakingReducer.actions;

export default speakingReducer.reducer;
