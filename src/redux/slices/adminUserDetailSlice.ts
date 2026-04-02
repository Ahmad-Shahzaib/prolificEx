import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminUserDetail, AdminUserDetailResponse, fetchAdminUserDetail } from "../thunk/adminUserDetailThunk";

interface AdminUserDetailState {
  loading: boolean;
  error: string | null;
  user: AdminUserDetail | null;
}

const initialState: AdminUserDetailState = {
  loading: false,
  error: null,
  user: null,
};

const adminUserDetailSlice = createSlice({
  name: "adminUserDetail",
  initialState,
  reducers: {
    resetAdminUserDetail(state) {
      state.loading = false;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminUserDetail.fulfilled,
        (state, action: PayloadAction<AdminUserDetailResponse>) => {
          state.loading = false;
          state.error = null;
          state.user = action.payload.data;
        }
      )
      .addCase(fetchAdminUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load user details";
      });
  },
});

export const { resetAdminUserDetail } = adminUserDetailSlice.actions;
export default adminUserDetailSlice.reducer;
