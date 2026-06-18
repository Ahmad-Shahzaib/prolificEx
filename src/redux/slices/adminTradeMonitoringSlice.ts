import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminTradeMonitoringData,
  AdminTradeMonitoringItem,
  AdminTradeMonitoringResponse,
  AdminTradeMonitoringSummary,
  fetchAdminTradeMonitoring,
} from "../thunk/adminTradeMonitoringThunk";

interface AdminTradeMonitoringState {
  loading: boolean;
  error: string | null;
  rows: AdminTradeMonitoringItem[];
  summary: AdminTradeMonitoringSummary;
  currentPage: number;
  perPage: number;
  total: number;
}

const emptySummary: AdminTradeMonitoringSummary = {
  total_count: 0,
  completed_count: 0,
  pending_count: 0,
  disputed_count: 0,
};

const initialState: AdminTradeMonitoringState = {
  loading: false,
  error: null,
  rows: [],
  summary: emptySummary,
  currentPage: 1,
  perPage: 20,
  total: 0,
};

const applyData = (state: AdminTradeMonitoringState, data: AdminTradeMonitoringData) => {
  state.rows = Array.isArray(data.data) ? data.data : [];
  state.summary = data.summary ?? emptySummary;
  state.currentPage = data.current_page ?? 1;
  state.perPage = data.per_page ?? 20;
  state.total = data.total ?? state.rows.length;
};

const adminTradeMonitoringSlice = createSlice({
  name: "adminTradeMonitoring",
  initialState,
  reducers: {
    resetAdminTradeMonitoringError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTradeMonitoring.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTradeMonitoring.fulfilled, (state, action: PayloadAction<AdminTradeMonitoringResponse>) => {
        state.loading = false;
        state.error = null;
        applyData(state, action.payload.data);
      })
      .addCase(fetchAdminTradeMonitoring.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load trade monitoring";
      });
  },
});

export const { resetAdminTradeMonitoringError } = adminTradeMonitoringSlice.actions;
export default adminTradeMonitoringSlice.reducer;
