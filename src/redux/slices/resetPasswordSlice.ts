import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetPassword, ResetPasswordResponse } from "../thunk/resetPasswordThunk";

interface ResetPasswordState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

const initialState: ResetPasswordState = {
  loading: false,
  error: null,
  message: null,
  success: false,
};

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    resetResetPassword(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<ResetPasswordResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload.message;
          state.success = true;
        }
      )
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Reset password failed";
        state.message = null;
        state.success = false;
      });
  },
});

export const { resetResetPassword } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
