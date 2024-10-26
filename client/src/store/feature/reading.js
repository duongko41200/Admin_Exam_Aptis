import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TextService from "../../services/API/tex.service";

const initialState = {
  numberQuestion: 1,
};

export const getAllText = createAsyncThunk(
  "wordStore/getAllText",
  async (payload, { state }) => {
    const listText = JSON.parse(localStorage.getItem("listText"));
    try {
      const { page, limit } = payload;
      const res = await TextService.getAllText({ page, limit });

      console.log("res:", res);

      if (!listText) {
        localStorage.setItem(
          "listText",
          JSON.stringify(res[RES_DATA].metadata.contents)
        );

        localStorage.setItem(
          "totalPages",
          JSON.stringify(res[RES_DATA].metadata.totalPages)
        );

        localStorage.setItem(
          "total",
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
  "wordStore/getListTextByFilter",
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

export const readingReducer = createSlice({
  name: "ReadingStore",
  initialState,
  reducers: {
    // SET_LIST_DATA: (state, action) => {
    //   state.listData = action.payload;
    // },
    // RESET_WORD: (state) => {
    //   state.wordObject = {};
    // },

    SET_INCREMENT: (state, action) => {
      state.numberQuestion += 1;
    },
    SET_DECREMENT: (state, action) => {
      state.numberQuestion -= 1;
    },

    //Action
  },
  extraReducers: (builder) => {
    builder.addCase(getAllText.fulfilled, (state, action) => {
      console.log("action:", action.payload);
      state.listData = action.payload.contents;
      state.totalPages = action.payload.totalPages;
    });

    builder.addCase(getListTextByFilter.fulfilled, (state, action) => {
      console.log("action filter:", action.payload);
      state.remainingQuantity = action.payload.contents.length;
      state.listTextReview = action.payload.contents;
      state.totalPagesReview = action.payload.totalPages;
      state.totalListTextReview = action.payload.total;
    });
  },
});

// Action creators are generated for each case reducer function
export const { SET_INCREMENT, SET_DECREMENT } = readingReducer.actions;

export default readingReducer.reducer;
