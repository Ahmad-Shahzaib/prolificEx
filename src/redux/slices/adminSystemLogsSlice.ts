import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminSystemLogsResponse,
  SystemLogSettings,
  fetchAdminSystemLogs,
  updateAdminSystemLogs,
} from "../thunk/adminSystemLogsThunk";

interface AdminSystemLogsState {
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
  message: string | null;
  settings: SystemLogSettings | null;
  updatedAt: string | null;
  updatedBy: number | string | null;
}

const initialState: AdminSystemLogsState = {
  loading: false,
  error: null,
  saving: false,
  saveError: null,
  message: null,
  settings: null,
  updatedAt: null,
  updatedBy: null,
};

const applyResponse = (state: AdminSystemLogsState, payload: AdminSystemLogsResponse) => {
  state.settings = payload.data.settings;
  state.updatedAt = payload.data.updated_at;
  state.updatedBy = payload.data.updated_by;
  state.message = payload.message;
};

const adminSystemLogsSlice = createSlice({
  name: "adminSystemLogs",
  initialState,
  reducers: {
    resetAdminSystemLogsMessages(state) {
      state.error = null;
      state.saveError = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSystemLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSystemLogs.fulfilled, (state, action: PayloadAction<AdminSystemLogsResponse>) => {
        state.loading = false;
        state.error = null;
        applyResponse(state, action.payload);
      })
      .addCase(fetchAdminSystemLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load system settings";
      })
      .addCase(updateAdminSystemLogs.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.message = null;
      })
      .addCase(updateAdminSystemLogs.fulfilled, (state, action: PayloadAction<AdminSystemLogsResponse>) => {
        state.saving = false;
        state.saveError = null;
        applyResponse(state, action.payload);
      })
      .addCase(updateAdminSystemLogs.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload || "Failed to update system settings";
      });
  },
});

export const { resetAdminSystemLogsMessages } = adminSystemLogsSlice.actions;
export default adminSystemLogsSlice.reducer;
