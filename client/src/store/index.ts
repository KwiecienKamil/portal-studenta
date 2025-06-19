// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import examReducer from "../features/exams/examSlice";

export const store = configureStore({
  reducer: {
    exams: examReducer,
  },
});

// Typy do TypeScriptu
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
