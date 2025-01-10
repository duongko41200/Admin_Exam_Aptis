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

});

// Action creators are generated for each case reducer function
export const {
  SET_TESTBANK_DATA,
  RESET_TESTBANK_DATA,
  SET_TESTBANK_DATA_EDIT,
} = testBankReducer.actions;

export default testBankReducer.reducer;
