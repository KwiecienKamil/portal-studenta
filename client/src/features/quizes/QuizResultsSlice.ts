import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchQuizResults = createAsyncThunk(
  "quizResults/fetchQuizResults",
  async (userId: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/quiz-results/${userId}`
    );

    if (!res.ok) {
      throw new Error("Błąd pobierania wyników quizu");
    }
    const data = await res.json();
    return data;
  }
);

const quizResultsSlice = createSlice({
  name: "quizResults",
  initialState: {
    results: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export default quizResultsSlice.reducer;
