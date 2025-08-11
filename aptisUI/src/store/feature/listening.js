import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	numberQuestion: 1,
	numberQuestionEachPart: 1,
	urlFile: '',
};

export const listeningReducer = createSlice({
	name: 'ListeningStore',
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
		}

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
	SET_URL_FILE
} = listeningReducer.actions;

export default listeningReducer.reducer;
