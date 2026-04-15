import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminP2PStatsData, fetchAdminP2PStats } from "../thunk/adminP2PStatsThunk";

interface AdminP2PStatsState {
  stats: AdminP2PStatsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminP2PStatsState = {
  stats: null,
  loading: false,
  error: null,
};

const adminP2PStatsSlice = createSlice({
  name: "adminP2PStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminP2PStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminP2PStats.fulfilled, (state, action: PayloadAction<{ success: boolean; message: string; data: AdminP2PStatsData }>) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchAdminP2PStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to load P2P stats";
      });
  },
});

export default adminP2PStatsSlice.reducer;
