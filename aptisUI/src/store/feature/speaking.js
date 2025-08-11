import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numberQuestion: 1,
  numberQuestionEachPart: 1,
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
      state.numberQuestionEachPart += 1;
    },
    SET_DECREMENT_SPEAKING_EACH_PART: (state) => {
      state.numberQuestionEachPart -= 1;
    },
    SET_RESET_NUMBER_QUESTION_SPEAKING: (state) => {
      state.numberQuestionEachPart = 1;
    },

    //Actiona
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_INCREMENT_SPEAKING,
  SET_DECREMENT_SPEAKING,
  SET_INCREMENT_SPEAKING_EACH_PART,
  SET_DECREMENT_SPEAKING_EACH_PART,
  SET_RESET_NUMBER_QUESTION_SPEAKING,
} = speakingReducer.actions;

export default speakingReducer.reducer;
