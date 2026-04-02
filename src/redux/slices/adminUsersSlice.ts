import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminUser,
  AdminUsersData,
  AdminUsersResponse,
  fetchAdminUsers,
  updateAdminUserStatus,
} from "../thunk/adminUsersThunk";

interface AdminUsersState {
  loading: boolean;
  error: string | null;
  updateUserStatusLoading: boolean;
  updateUserStatusError: string | null;
  users: AdminUser[];
  pagination: AdminUsersData | null;
}

const initialState: AdminUsersState = {
  loading: false,
  error: null,
  updateUserStatusLoading: false,
  updateUserStatusError: null,
  users: [],
  pagination: null,
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    resetAdminUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminUsers.fulfilled,
        (state, action: PayloadAction<AdminUsersResponse>) => {
          state.loading = false;
          state.error = null;
          state.users = action.payload.data.data;
          state.pagination = action.payload.data;
        }
      )
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load users";
      })
      .addCase(updateAdminUserStatus.pending, (state) => {
        state.updateUserStatusLoading = true;
        state.updateUserStatusError = null;
      })
      .addCase(updateAdminUserStatus.fulfilled, (state, action) => {
        state.updateUserStatusLoading = false;
        state.updateUserStatusError = null;

        const { userId, status } = action.meta.arg;
        const user = state.users.find((row) => row.id === userId);
        if (user) {
          user.status = action.payload.data?.status || status;
        }
      })
      .addCase(updateAdminUserStatus.rejected, (state, action) => {
        state.updateUserStatusLoading = false;
        state.updateUserStatusError = action.payload || "Failed to update status";
      });
  },
});

export const { resetAdminUsersError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
