import { configureStore } from "@reduxjs/toolkit";
import listeningReducer from "./feature/listening";
import readingReducer from "./feature/reading";
import speakingReducer from "./feature/speaking";
import testBankReducer from "./feature/testBank";
import writingReducer from "./feature/writing";
import generalReducer from "./general";
import taiLieuReducer from "./taiLieu";

export const store = configureStore({
  reducer: {
    testBankStore: testBankReducer,
    generalStore: generalReducer,
    taiLieuStore: taiLieuReducer,
    readingStore: readingReducer,
    writingStore: writingReducer,
    speakingStore: speakingReducer,
    listeningStore: listeningReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;
