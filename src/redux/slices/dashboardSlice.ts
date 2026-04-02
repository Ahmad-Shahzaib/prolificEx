import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchDashboardStats, DashboardStatsResponse } from "../thunk/dashboardStatsThunk";

interface DashboardState {
  loading: boolean;
  error: string | null;
  stats: DashboardStatsResponse["data"] | null;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  stats: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStatsResponse>) => {
          state.loading = false;
          state.error = null;
          state.stats = action.payload.data;
        }
      )
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard stats";
      });
  },
});

export const { resetDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
