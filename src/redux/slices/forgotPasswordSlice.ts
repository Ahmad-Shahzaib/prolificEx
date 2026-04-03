import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { forgotPassword, ForgotPasswordResponse } from "../thunk/forgotPasswordThunk";

interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  message: null,
  success: false,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    resetForgotPassword(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(
        forgotPassword.fulfilled,
        (state, action: PayloadAction<ForgotPasswordResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload.message;
          state.success = true;
        }
      )
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Reset request failed";
        state.message = null;
        state.success = false;
      });
  },
});

export const { resetForgotPassword } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
