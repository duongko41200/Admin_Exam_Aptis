import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	openModalBottom: false,
	currentExamPart:'reading',
};

export const generalReducer = createSlice({
	name: 'generalStore',
	initialState,
	reducers: {

		SET_OPEN_MODAL_BOTTOM: (state, action) => {
			console.log("auth",action.payload)
			state.openModalBottom = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {  SET_OPEN_MODAL_BOTTOM } = generalReducer.actions;

export default generalReducer.reducer;
