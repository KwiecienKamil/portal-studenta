import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface ExamData {
  id?: number;
  subject: string;
  date: string;
  term: "1" | "2" | "3";
  note: string;
  user_id: string;
  completed?: boolean;
}

interface ExamsState {
  exams: ExamData[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamsState = {
  exams: [],
  loading: false,
  error: null,
};

export const fetchExams = createAsyncThunk<ExamData[], string>(
  "exams/fetchExams",
  async (userId) => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/exams/${userId}`
    );
    if (!res.ok) throw new Error("Nie udało się pobrać egzaminów");
    return (await res.json()) as ExamData[];
  }
);

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
    updateExam: (state, action: PayloadAction<ExamData>) => {
      const index = state.exams.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExams.fulfilled,
        (state, action: PayloadAction<ExamData[]>) => {
          state.loading = false;
          state.exams = action.payload;
        }
      )
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addExam, removeExam, setExams, updateExam } = examSlice.actions;
export default examSlice.reducer;
