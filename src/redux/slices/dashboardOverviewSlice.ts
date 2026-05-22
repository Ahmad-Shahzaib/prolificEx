import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchDashboardOverview, DashboardOverviewResponse } from "../thunk/dashboardOverviewThunk";

interface DashboardOverviewState {
  loading: boolean;
  error: string | null;
  data: DashboardOverviewResponse["data"] | null;
}

const initialState: DashboardOverviewState = {
  loading: false,
  error: null,
  data: null,
};

const dashboardOverviewSlice = createSlice({
  name: "dashboardOverview",
  initialState,
  reducers: {
    clearDashboardOverview(state) {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardOverview.fulfilled,
        (state, action: PayloadAction<DashboardOverviewResponse>) => {
          state.loading = false;
          state.error = null;
          state.data = action.payload.data;
        }
      )
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard overview";
      });
  },
});

export const { clearDashboardOverview } = dashboardOverviewSlice.actions;
export default dashboardOverviewSlice.reducer;
