import { createSlice } from '@reduxjs/toolkit';

const convertCurrentExamSkill = (currentExamPart) => {
	switch (currentExamPart) {
		case 1:
			return 'speaking';
		case 2:
			return 'listening';
		case 3:
			return 'reading';
		case 4:
			return 'writing';
		case 5:
			return 'result';

		default:
			return 'speaking';
	}
};
const initialState = {
	openModalBottom: false,
	currentExamPart: 'speaking',
	pointExam: 1, // current point skill exam
	isModalList: false,
	isShowResult: false,
	isModalListSugestion: false,
	isModalSetting: false,
	isShowOverallScore: false,
	Score4Part: {
		speaking: 0,
		listening: 0,
		reading: 0,
		writing: 0,

		startDate: '',
	},

	isCheckoutResult: false,
	isCountdown: true,
	isZoomSuggestion: false,
	isModalInfo: false,
	isAiScore: false,
	isModalNotify: false,
	isRecord: false,
};

export const generalReducer = createSlice({
	name: 'generalStore',
	initialState,
	reducers: {
		SET_OPEN_MODAL_BOTTOM: (state, action) => {
			state.openModalBottom = action.payload;
		},

		SET_MOVE_EXAM_SKILL: (state) => {
			state.currentExamPart = convertCurrentExamSkill(
				state.pointExam + 1
			);
			state.pointExam = state.pointExam + 1;
			if (convertCurrentExamSkill(state.pointExam + 1) === 'result') {
				state.isCheckoutResult = true;
			}
		},
		SET_RESET_PART_SKILL: (state) => {
			state.currentExamPart = 'speaking';
			state.pointExam = 1;
		},
		SET_RESULT_TEST: (state) => {
			state.currentExamPart = 'result';
			state.pointExam = 5;
		},
		SET_MODAL_LIST: (state, action) => {
			state.isModalList = action.payload;
		},
		SET_MODAL_LIST_SUGESTION: (state, action) => {
			state.isModalListSugestion = action.payload;
		},
		SET_IS_SHOW_RESULT: (state, action) => {
			state.isShowResult = action.payload;
		},
		SET_IS_SHOW_OVERALL_SCORE: (state, action) => {
			state.isShowOverallScore = action.payload;
		},
		SET_SCORE_4_PART: (state, action) => {
			state.Score4Part = action.payload;
		},
		SET_IS_CHECKOUT_RESULT: (state, action) => {
			state.isCheckoutResult = action.payload;
		},
		SET_IS_MODAL_SETTING: (state, action) => {
			state.isModalSetting = action.payload;
		},
		SET_IS_COUNTDOWN: (state, action) => {
			state.isCountdown = action.payload;
		},
		SET_IS_ZOOM_SUGGESTION: (state, action) => {
			state.isZoomSuggestion = action.payload;
		},
		SET_IS_MODAL_INFO: (state, action) => {
			state.isModalInfo = action.payload;
		},
		SET_AI_SCORE: (state, action) => {
			state.isAiScore = action.payload;
		},
		SET_MODAL_NOTIFY: (state, action) => {
			state.isModalNotify = action.payload;
		},
		SET_IS_RECORD: (state, action) => {
			state.isRecord = action.payload;
		},
	},
});

export const {
	SET_OPEN_MODAL_BOTTOM,
	SET_MOVE_EXAM_SKILL,
	SET_RESET_PART_SKILL,
	SET_RESULT_TEST,
	SET_MODAL_LIST,
	SET_IS_SHOW_RESULT,
	SET_IS_SHOW_OVERALL_SCORE,
	SET_SCORE_4_PART,
	SET_IS_CHECKOUT_RESULT,
	SET_MODAL_LIST_SUGESTION,
	SET_IS_MODAL_SETTING,
	SET_IS_COUNTDOWN,
	SET_IS_ZOOM_SUGGESTION,
	SET_IS_MODAL_INFO,
	SET_AI_SCORE,
	SET_MODAL_NOTIFY,
	SET_IS_RECORD,
} = generalReducer.actions;

export default generalReducer.reducer;
