import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: '',
};

export const authReducer = createSlice({
	name: 'authStore',
	initialState,
	reducers: {

		SET_USER: (state, action) => {
			console.log("auth",action.payload)
			state.user = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {  SET_USER } = authReducer.actions;

export default authReducer.reducer;
