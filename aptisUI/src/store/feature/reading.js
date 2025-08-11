import {  createSlice } from '@reduxjs/toolkit';

const initialState = {
	numberQuestion: 1,
};

export const readingReducer = createSlice({
	name: 'ReadingStore',
	initialState,
	reducers: {
		// SET_LIST_DATA: (state, action) => {
		//   state.listData = action.payload;
		// },
		// RESET_WORD: (state) => {
		//   state.wordObject = {};
		// },

		SET_INCREMENT: (state) => {
			state.numberQuestion += 1;
		},
		SET_DECREMENT: (state) => {
			state.numberQuestion -= 1;
		},
		SET_RESET_NUMBER_QUESTION: (state) => {
			state.numberQuestion = 1;
		},
		SET_NUMBER_QUESTION_READING: (state, action) => {
			state.numberQuestion = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	SET_INCREMENT,
	SET_DECREMENT,
	SET_RESET_NUMBER_QUESTION,
	SET_NUMBER_QUESTION_READING,
} = readingReducer.actions;

export default readingReducer.reducer;
