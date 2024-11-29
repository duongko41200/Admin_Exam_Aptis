import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  testBankData: {
    title: "đề mẫu",
    speaking: {
      part1: [],
      part2: [],
      part3: [],
      part4: [],
    },
    listening: {
      part1: [],
      part2: [],
      part3: [],
      part4: [],
      part5: [],
    },
    reading: {
      part1: [],
      part2: [],
      part3: [],
      part4: [],
      part5: [],
    },
    writing: {
      part1: [],
      part2: [],
      part3: [],
      part4: [],
    },
  },
};

// export const getAllText = createAsyncThunk(
// 	'wordStore/getAllText',
// 	async (payload, { state }) => {
// 		const listText = JSON.parse(localStorage.getItem('listText'));
// 		try {
// 			const { page, limit } = payload;
// 			const res = await TextService.getAllText({ page, limit });

// 			console.log('res:', res);

// 			if (!listText) {
// 				localStorage.setItem(
// 					'listText',
// 					JSON.stringify(res[RES_DATA].metadata.contents)
// 				);

// 				localStorage.setItem(
// 					'totalPages',
// 					JSON.stringify(res[RES_DATA].metadata.totalPages)
// 				);

// 				localStorage.setItem(
// 					'total',
// 					JSON.stringify(res[RES_DATA].metadata.total)
// 				);
// 			}

// 			return res[RES_DATA]?.metadata;
// 		} catch (error) {
// 			throw new Error(error.message);
// 		}
// 	}
// );

// export const getListTextByFilter = createAsyncThunk(
// 	'wordStore/getListTextByFilter',
// 	async (payload) => {
// 		// const listText = JSON.parse(localStorage.getItem('listText'));
// 		try {
// 			const { page, limit, level, typeText, date } = payload;

// 			const res = await TextService.getListTextByFilter({
// 				page,
// 				limit,
// 				level,
// 				typeText,
// 				date,
// 			});

// 			// if (!listText) {
// 			// 	localStorage.setItem(
// 			// 		'listText',
// 			// 		JSON.stringify(res[RES_DATA].metadata.contents)
// 			// 	);

// 			// 	localStorage.setItem(
// 			// 		'totalPages',
// 			// 		JSON.stringify(res[RES_DATA].metadata.totalPages)
// 			// 	);

// 			// 	localStorage.setItem(
// 			// 		'total',
// 			// 		JSON.stringify(res[RES_DATA].metadata.total)
// 			// 	);
// 			// }

// 			return res[RES_DATA]?.metadata;
// 		} catch (error) {
// 			console.log({ error });
// 			throw new Error(error.message);
// 		}
// 	}
// );
// export const deleteText = createAsyncThunk(
// 	'wordStore/deleteText',
// 	async (payload, thunkAPI) => {
// 		try {
// 			const { page, limit, level, typeText, date } =
// 				thunkAPI.getState().wordStore;
// 			const { textId } = payload;

// 			const res = await TextService.deleteText({
// 				page:
// 					thunkAPI.getState().wordStore.remainingQuantity == 1
// 						? parseInt(page) - 1
// 						: page,
// 				limit,
// 				level,
// 				typeText,
// 				date,
// 				textId,
// 			});

// 			localStorage.removeItem('listText');

// 			// if (!listText) {
// 			// 	localStorage.setItem(
// 			// 		'listText',
// 			// 		JSON.stringify(res[RES_DATA].metadata.contents)
// 			// 	);

// 			// 	localStorage.setItem(
// 			// 		'totalPages',
// 			// 		JSON.stringify(res[RES_DATA].metadata.totalPages)
// 			// 	);

// 			// 	localStorage.setItem(
// 			// 		'total',
// 			// 		JSON.stringify(res[RES_DATA].metadata.total)
// 			// 	);
// 			// }

// 			return res[RES_DATA]?.metadata;
// 		} catch (error) {
// 			console.log({ error });
// 			throw new Error(error.message);
// 		}
// 	}
// );

export const testBankReducer = createSlice({
  name: "testBankStore",
  initialState,
  reducers: {
    SET_TESTBANK_DATA: (state, action) => {
      state.testBankData[action.payload.type][
        `part${action.payload.partSkill}`
      ] = action.payload.newSelection;
    },
    RESET_TESTBANK_DATA: (state, action) => {
      state.testBankData = {
        title: "đề mẫu",
        speaking: {
          part1: [],
          part2: [],
          part3: [],
          part4: [],
        },
        listening: {
          part1: [],
          part2: [],
          part3: [],
          part4: [],
          part5: [],
        },
        reading: {
          part1: [],
          part2: [],
          part3: [],
          part4: [],
          part5: [],
        },
        writing: {
          part1: [],
          part2: [],
          part3: [],
          part4: [],
        },
      };
    },
    SET_TESTBANK_DATA_EDIT: (state, action) => {
      state.testBankData = action.payload;
    },

    //Action
  },
  // extraReducers: (builder) => {
  // 	builder.addCase(getAllText.fulfilled, (state, action) => {
  // 		console.log('action:', action.payload);
  // 		state.listData = action.payload.contents;
  // 		state.totalPages = action.payload.totalPages;
  // 	});

  // 	builder.addCase(getListTextByFilter.fulfilled, (state, action) => {
  // 		console.log('action filter:', action.payload);
  // 		state.remainingQuantity = action.payload.contents.length;
  // 		state.listTextReview = action.payload.contents;
  // 		state.totalPagesReview = action.payload.totalPages;
  // 		state.totalListTextReview = action.payload.total;
  // 	});
  // 	builder.addCase(deleteText.fulfilled, (state, action) => {
  // 		console.log('action delete:', action.payload);
  // 		state.remainingQuantity = action.payload.contents.length;
  // 		state.listTextReview = action.payload.contents;
  // 		state.totalPagesReview = action.payload.totalPages;
  // 		state.totalListTextReview = action.payload.total;
  // 	});
  // },
});

// Action creators are generated for each case reducer function
export const {
  SET_TESTBANK_DATA,
  RESET_TESTBANK_DATA,
  SET_TESTBANK_DATA_EDIT,
} = testBankReducer.actions;

export default testBankReducer.reducer;
