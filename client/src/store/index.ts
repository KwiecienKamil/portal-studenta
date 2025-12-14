import { configureStore } from "@reduxjs/toolkit";
import examReducer from "../features/exams/examSlice";
import authReducer from "../features/auth/authSlice";
import quizReducer from "../features/quizes/QuizResultsSlice";

export const store = configureStore({
  reducer: {
    exams: examReducer,
    auth: authReducer,
    quizes: quizReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
