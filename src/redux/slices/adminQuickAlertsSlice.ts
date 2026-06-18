import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminQuickAlert,
  AdminQuickAlertsResponse,
  fetchAdminQuickAlerts,
} from "../thunk/adminQuickAlertsThunk";

interface AdminQuickAlertsState {
  loading: boolean;
  error: string | null;
  total: number;
  alerts: AdminQuickAlert[];
}

const initialState: AdminQuickAlertsState = {
  loading: false,
  error: null,
  total: 0,
  alerts: [],
};

const adminQuickAlertsSlice = createSlice({
  name: "adminQuickAlerts",
  initialState,
  reducers: {
    resetAdminQuickAlertsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminQuickAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminQuickAlerts.fulfilled, (state, action: PayloadAction<AdminQuickAlertsResponse>) => {
        state.loading = false;
        state.error = null;
        state.total = action.payload.data.total;
        state.alerts = Array.isArray(action.payload.data.alerts) ? action.payload.data.alerts : [];
      })
      .addCase(fetchAdminQuickAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load quick alerts";
      });
  },
});

export const { resetAdminQuickAlertsError } = adminQuickAlertsSlice.actions;
export default adminQuickAlertsSlice.reducer;
