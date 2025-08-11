import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	openModalBottom: false,
	listening: [],
	isJoinZoomTest: false,
	currentNumberQuestion: 0,
	totalQuestion: 0,
	isCheckResult: false,
	currentSkillName: '',
	currentPartName: '',

	indexSubQuestion: 0,
	isPlayRecord: false,

	numberOfSubQuestions: 0,
	isShowFullQuestion: false,
	currentNumberQuesBeforeChange: '',
};

export const taiLieuReducer = createSlice({
	name: 'taiLieuStore',
	initialState,
	reducers: {
		SET_OPEN_MODAL_BOTTOM: (state, action) => {
			state.openModalBottom = action.payload;
		},
		SET_LISTENING: (state, action) => {
			state.listening = action.payload;
		},
		SET_IS_JOIN_TEST: (state, action) => {
			state.isJoinZoomTest = action.payload;
		},
		SET_TOTAL_QUESTION: (state, action) => {
			state.totalQuestion = action.payload;
		},
		SET_CURRENT_NUMBER_QUESTION_INCREASE: (state, action) => {
			console.log('action', action);
			if (state.currentNumberQuestion < state.totalQuestion) {
				state.currentNumberQuestion++;
			}
		},
		SET_CURRENT_NUMBER_QUESTION_DECREASE: (state, action) => {
			console.log('action', action);
			if (state.currentNumberQuestion > 0) {
				state.currentNumberQuestion--;
			}
		},
		SET_UPDATE_CURRENT_NUMBER_QUESTION: (state, action) => {
			state.currentNumberQuestion = action.payload;
		},
		SET_RESPONSE_RESULT_LISTENING: (state, action) => {
			if (action.payload.typePart === 1) {
				state.listening[state.currentNumberQuestion].responseUser =
					action.payload.value;
			}
			if (
				action.payload.typePart === 2 ||
				action.payload.typePart === 3
			) {
				state.listening[state.currentNumberQuestion]['subQuestion'][
					action.payload.index
				]['responseUser'] = action.payload.value;
			}
			if (action.payload.typePart === 4) {
				state.listening[state.currentNumberQuestion]['subQuestion'][
					action.payload.index
				]['responseUser'] = action.payload.value;

				console.log('state.listening', state.listening);
			}
		},

		SET_RESPONSE_RESULT_READING: (state, action) => {
			if (action.payload.typePart === 1) {
				state.listening[state.currentNumberQuestion]['subQuestion'][
					action.payload.index
				]['responseUser'] = action.payload.value;
			}
			if (action.payload.typePart === 2) {
				state.listening[state.currentNumberQuestion]['responseUser'] =
					action.payload.value;
			}
			if (action.payload.typePart === 3) {
				state.listening[state.currentNumberQuestion]['subQuestion'][
					action.payload.index
				]['responseUser'] = action.payload.value;
			}
			if (action.payload.typePart === 4) {
				state.listening[state.currentNumberQuestion]['subQuestion'][
					action.payload.index
				]['responseUser'] = action.payload.value;
			}
		},
		SET_RESPONSE_RESULT_WRITING: (state, action) => {
			console.log(
				'action sdfsdf',
				state.listening[state.currentNumberQuestion]
			);
			state.listening[state.currentNumberQuestion]['subQuestion'][
				action.payload.index
			]['responseUser'] = action.payload.value;
		},
		SET_RESPONSE_RESULT_SPEAKING: (state, action) => {
			if (state.currentPartName === 1 || state.currentPartName === 4) {
				state.listening[state.currentNumberQuesBeforeChange ?? 0][
					'responseUser'
				] = action.payload.value;
			}
			if (state.currentPartName === 2 || state.currentPartName === 3) {
				state.listening[state.currentNumberQuesBeforeChange][
					state.numberOfSubQuestions
				]['responseUser'] = action.payload.value;
			}
		},

		SET_PLAY_RECORD: (state, action) => {
			state.isPlayRecord = action.payload;
		},

		SET_CHECK_RESULT: (state, action) => {
			state.isCheckResult = action.payload;
		},
		SET_CURRENT_SKILL_NAME: (state, action) => {
			state.currentSkillName = action.payload;
		},
		SET_CURRENT_PART_NAME: (state, action) => {
			state.currentPartName = action.payload;
		},
		SET_INDEX_SUB_QUESTION: (state, action) => {
			state.indexSubQuestion = action.payload;
		},
		SET_RESPONSE_SCORE_AI: (state, action) => {
			state.listening[state.currentNumberQuestion]['subQuestion'][
				action.payload.index
			]['responseAI'] = action.payload.value;
		},
		SET_NUMBER_OF_SUB_QUESTIONS: (state, action) => {
			state.numberOfSubQuestions = action.payload;
		},
		SET_IS_SHOW_FULL_QUESTION: (state, action) => {
			state.isShowFullQuestion = action.payload;
		},
		SET_CURRENT_NUMBER_QUES_BEFORE_CHANGE: (state, action) => {
			state.currentNumberQuesBeforeChange = action.payload;
		},
	},
});

export const {
	SET_OPEN_MODAL_BOTTOM,
	SET_LISTENING,
	SET_IS_JOIN_TEST,
	SET_CURRENT_NUMBER_QUESTION_INCREASE,
	SET_CURRENT_NUMBER_QUESTION_DECREASE,
	SET_TOTAL_QUESTION,
	SET_UPDATE_CURRENT_NUMBER_QUESTION,
	SET_RESPONSE_RESULT_LISTENING,
	SET_CHECK_RESULT,
	SET_CURRENT_SKILL_NAME,
	SET_CURRENT_PART_NAME,
	SET_INDEX_SUB_QUESTION,
	SET_RESPONSE_RESULT_READING,
	SET_RESPONSE_RESULT_WRITING,
	SET_RESPONSE_SCORE_AI,
	SET_RESPONSE_RESULT_SPEAKING,
	SET_PLAY_RECORD,
	SET_NUMBER_OF_SUB_QUESTIONS,
	SET_IS_SHOW_FULL_QUESTION,
	SET_CURRENT_NUMBER_QUES_BEFORE_CHANGE,
} = taiLieuReducer.actions;

export default taiLieuReducer.reducer;
