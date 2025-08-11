import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numberQuestion: 1,
  numberQuestionEachPart: 1,
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
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_INCREMENT_WRITING,
  SET_DECREMENT_WRITING,
  SET_NUMBER_QUESTION_WRITING,
} = writingReducer.actions;

export default writingReducer.reducer;
