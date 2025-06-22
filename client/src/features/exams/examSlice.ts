import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ExamData {
  id?: number;
  subject: string;
  date: string;
  term: "1" | "2" | "3";
  note: string;
  user_id: string;
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
      state.exams = state.exams.filter((exam) => exam.id !== action.payload);
    },
    setExams: (state, action: PayloadAction<ExamData[]>) => {
      state.exams = action.payload;
    },
  },
});

export const { addExam, removeExam, setExams } = examSlice.actions;
export default examSlice.reducer;
