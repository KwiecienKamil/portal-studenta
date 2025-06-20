import { configureStore } from "@reduxjs/toolkit";
import examReducer from "../features/exams/examSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    exams: examReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
