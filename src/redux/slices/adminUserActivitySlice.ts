import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminUserActivityData,
  AdminUserActivityResponse,
  fetchAdminUserActivity,
} from "../thunk/adminUserActivityThunk";

interface AdminUserActivityState {
  loading: boolean;
  error: string | null;
  data: AdminUserActivityData | null;
}

const initialState: AdminUserActivityState = {
  loading: false,
  error: null,
  data: null,
};

const adminUserActivitySlice = createSlice({
  name: "adminUserActivity",
  initialState,
  reducers: {
    resetAdminUserActivityError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUserActivity.fulfilled, (state, action: PayloadAction<AdminUserActivityResponse>) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
      })
      .addCase(fetchAdminUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load user activity";
      });
  },
});

export const { resetAdminUserActivityError } = adminUserActivitySlice.actions;
export default adminUserActivitySlice.reducer;
