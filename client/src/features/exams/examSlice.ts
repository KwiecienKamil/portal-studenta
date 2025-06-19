// features/exams/examSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ExamData {
  subject: string;
  date: string;
  term: "1" | "2" | "3";
  note: string;
}

interface ExamsState {
  exams: ExamData[];
}

const initialState: ExamsState = {
  exams: [],
};

const examSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    addExam: (state, action: PayloadAction<ExamData>) => {
      state.exams.push(action.payload);
    },
    removeExam: (state, action: PayloadAction<number>) => {
      state.exams.splice(action.payload, 1);
    },
  },
});

export const { addExam, removeExam } = examSlice.actions;

export default examSlice.reducer;
