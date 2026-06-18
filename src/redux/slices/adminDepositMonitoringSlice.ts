import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminDepositMonitoringItem,
  AdminDepositMonitoringResponse,
  AdminDepositMonitoringSummary,
  fetchAdminDepositMonitoring,
} from "../thunk/adminDepositMonitoringThunk";

interface AdminDepositMonitoringState {
  loading: boolean;
  error: string | null;
  rows: AdminDepositMonitoringItem[];
  summary: AdminDepositMonitoringSummary;
  currentPage: number;
  perPage: number;
  total: number;
}

const emptySummary: AdminDepositMonitoringSummary = {
  total_count: 0,
  pending_count: 0,
  completed_count: 0,
};

const initialState: AdminDepositMonitoringState = {
  loading: false,
  error: null,
  rows: [],
  summary: emptySummary,
  currentPage: 1,
  perPage: 20,
  total: 0,
};

const adminDepositMonitoringSlice = createSlice({
  name: "adminDepositMonitoring",
  initialState,
  reducers: {
    resetAdminDepositMonitoringError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDepositMonitoring.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDepositMonitoring.fulfilled, (state, action: PayloadAction<AdminDepositMonitoringResponse>) => {
        state.loading = false;
        state.error = null;
        state.rows = Array.isArray(action.payload.data.data) ? action.payload.data.data : [];
        state.summary = action.payload.data.summary ?? emptySummary;
        state.currentPage = action.payload.data.current_page ?? 1;
        state.perPage = action.payload.data.per_page ?? 20;
        state.total = action.payload.data.total ?? state.rows.length;
      })
      .addCase(fetchAdminDepositMonitoring.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load deposit monitoring";
      });
  },
});

export const { resetAdminDepositMonitoringError } = adminDepositMonitoringSlice.actions;
export default adminDepositMonitoringSlice.reducer;
