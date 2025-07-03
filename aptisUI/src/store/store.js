import { configureStore } from "@reduxjs/toolkit";
import testBankReducer from "./feature/testBank";

export const store = configureStore({
  reducer: {
    testBankStore: testBankReducer,
  },
});
