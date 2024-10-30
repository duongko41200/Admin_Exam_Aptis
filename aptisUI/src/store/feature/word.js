import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	LIMIT_LIST_TEXT_OF_PAGE,
	RES_DATA,
} from '../../Constant/global';
import TextService from '../../services/API/tex.service';

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

const initialState = {
	remainingQuantity: '',

	typeText: '',
	wordObject: {},

	listData: [],
	totalPages: '',
	totalText: '',

	listTextReview: [],
	totalPagesReview: '',
	totalListTextReview: '',

	textDetail: '',
	openModalDetailText: false,

	page: '1',
	limit: LIMIT_LIST_TEXT_OF_PAGE,
	level: 'all',
	typeText: 'all',
	date: `${currentYear}-${currentMonth}`,
};

export const getAllText = createAsyncThunk(
	'wordStore/getAllText',
	async (payload, { state }) => {
		const listText = JSON.parse(localStorage.getItem('listText'));
		try {
			const { page, limit } = payload;
			const res = await TextService.getAllText({ page, limit });

			console.log('res:', res);

			if (!listText) {
				localStorage.setItem(
					'listText',
					JSON.stringify(res[RES_DATA].metadata.contents)
				);

				localStorage.setItem(
					'totalPages',
					JSON.stringify(res[RES_DATA].metadata.totalPages)
				);

				localStorage.setItem(
					'total',
					JSON.stringify(res[RES_DATA].metadata.total)
				);
			}

			return res[RES_DATA]?.metadata;
		} catch (error) {
			throw new Error(error.message);
		}
	}
);

export const getListTextByFilter = createAsyncThunk(
	'wordStore/getListTextByFilter',
	async (payload) => {
		// const listText = JSON.parse(localStorage.getItem('listText'));
		try {
			const { page, limit, level, typeText, date } = payload;

			const res = await TextService.getListTextByFilter({
				page,
				limit,
				level,
				typeText,
				date,
			});

			// if (!listText) {
			// 	localStorage.setItem(
			// 		'listText',
			// 		JSON.stringify(res[RES_DATA].metadata.contents)
			// 	);

			// 	localStorage.setItem(
			// 		'totalPages',
			// 		JSON.stringify(res[RES_DATA].metadata.totalPages)
			// 	);

			// 	localStorage.setItem(
			// 		'total',
			// 		JSON.stringify(res[RES_DATA].metadata.total)
			// 	);
			// }

			return res[RES_DATA]?.metadata;
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	}
);
export const deleteText = createAsyncThunk(
	'wordStore/deleteText',
	async (payload, thunkAPI) => {
		try {
			const { page, limit, level, typeText, date } =
				thunkAPI.getState().wordStore;
			const { textId } = payload;


			const res = await TextService.deleteText({
				page:
					thunkAPI.getState().wordStore.remainingQuantity == 1
						? parseInt(page) - 1
						: page,
				limit,
				level,
				typeText,
				date,
				textId,
			});

			localStorage.removeItem('listText');

			// if (!listText) {
			// 	localStorage.setItem(
			// 		'listText',
			// 		JSON.stringify(res[RES_DATA].metadata.contents)
			// 	);

			// 	localStorage.setItem(
			// 		'totalPages',
			// 		JSON.stringify(res[RES_DATA].metadata.totalPages)
			// 	);

			// 	localStorage.setItem(
			// 		'total',
			// 		JSON.stringify(res[RES_DATA].metadata.total)
			// 	);
			// }

			return res[RES_DATA]?.metadata;
		} catch (error) {
			console.log({ error });
			throw new Error(error.message);
		}
	}
);

export const wordReducer = createSlice({
	name: 'wordStore',
	initialState,
	reducers: {
		SET_WORD: (state, action) => {
			state.wordObject[`${Object.keys(action.payload)}`] =
				action.payload[`${Object.keys(action.payload)}`];
		},
		SET_TYPE_TEXT: (state, action) => {
			console.log('action type text:', action);
			state.typeText = action.payload;
		},
		SET_LIST_DATA: (state, action) => {
			state.listData = action.payload;
		},
		RESET_WORD: (state) => {
			state.wordObject = {};
		},
		SET_TOTAL_PAGE: (state, action) => {
			state.totalPages = action.payload;
		},
		SET_TOTAL_TEXT: (state, action) => {
			state.totalText = action.payload;
		},
		SET_OPEN_MODAL_DETAIL_TEXT: (state, action) => {
			state.openModalDetailText = action.payload;
		},
		SET_TEXT_DETAIL: (state, action) => {
			state.textDetail = action.payload;
		},
		SET_ELEMENT_FILTER: (state, action) => {
			state[action.payload.type] = action.payload.content;
		},
		SET_UPDATE_TEXT: (state, action) => {
			let dataUpdate = action.payload;
			state.listTextReview = state.listTextReview.map((data) => {
				if (data._id === dataUpdate.textId) {
					data.text = dataUpdate.text;
					data.defind = dataUpdate.defind;
					data.attributes = dataUpdate.attributes;
					data.topicId._id = dataUpdate.topicId;
					data.topicId.name = dataUpdate.topic;
				}

				return data;
			});
		},

		//Action
	},
	extraReducers: (builder) => {
		builder.addCase(getAllText.fulfilled, (state, action) => {
			console.log('action:', action.payload);
			state.listData = action.payload.contents;
			state.totalPages = action.payload.totalPages;
		});

		builder.addCase(getListTextByFilter.fulfilled, (state, action) => {
			console.log('action filter:', action.payload);
			state.remainingQuantity = action.payload.contents.length;
			state.listTextReview = action.payload.contents;
			state.totalPagesReview = action.payload.totalPages;
			state.totalListTextReview = action.payload.total;
		});
		builder.addCase(deleteText.fulfilled, (state, action) => {
			console.log('action delete:', action.payload);
			state.remainingQuantity = action.payload.contents.length;
			state.listTextReview = action.payload.contents;
			state.totalPagesReview = action.payload.totalPages;
			state.totalListTextReview = action.payload.total;
		});
	},
});

// Action creators are generated for each case reducer function
export const {
	SET_WORD,
	SET_TOTAL_TEXT,
	SET_TYPE_TEXT,
	RESET_WORD,
	SET_LIST_DATA,
	SET_TOTAL_PAGE,
	SET_OPEN_MODAL_DETAIL_TEXT,
	SET_TEXT_DETAIL,
	SET_ELEMENT_FILTER,
	SET_UPDATE_TEXT,
} = wordReducer.actions;

export default wordReducer.reducer;
