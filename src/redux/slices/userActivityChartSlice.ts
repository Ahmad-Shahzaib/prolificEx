import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserActivityChart, UserActivityChartRange, UserActivityChartResponse } from "../thunk/userActivityChartThunk";

interface UserActivityChartState {
  loading: boolean;
  error: string | null;
  data: UserActivityChartResponse["data"] | null;
  loadedAt: number | null;
  currentRange: UserActivityChartRange | null;
}

const initialState: UserActivityChartState = {
  loading: false,
  error: null,
  data: null,
  loadedAt: null,
  currentRange: null,
};

const userActivityChartSlice = createSlice({
  name: "userActivityChart",
  initialState,
  reducers: {
    clearUserActivityChart(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.loadedAt = null;
      state.currentRange = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActivityChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserActivityChart.fulfilled,
        (state, action: PayloadAction<UserActivityChartResponse>) => {
          state.loading = false;
          state.error = null;
          state.data = action.payload.data;
          state.loadedAt = Date.now();
          state.currentRange = action.payload.data.range;
        }
      )
      .addCase(fetchUserActivityChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load user activity chart";
      });
  },
});

export const { clearUserActivityChart } = userActivityChartSlice.actions;
export default userActivityChartSlice.reducer;
