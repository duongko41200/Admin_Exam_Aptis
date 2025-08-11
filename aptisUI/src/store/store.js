import { configureStore } from "@reduxjs/toolkit";
import testBankReducer from "./feature/testBank";
import generalReducer from "./general";
import taiLieuReducer from "./taiLieu";
import readingReducer from "./feature/reading";
import writingReducer from "./feature/writing";
import speakingReducer from "./feature/speaking";
import listeningReducer from "./feature/listening";

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
