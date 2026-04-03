import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { verifyEmail, VerifyEmailResponse } from '../thunk/verifyEmailThunk';

interface VerifyEmailState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: VerifyEmailState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

const verifyEmailSlice = createSlice({
  name: 'verifyEmail',
  initialState,
  reducers: {
    resetVerifyEmailState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<VerifyEmailResponse>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Email verification failed';
        state.success = false;
      });
  },
});

export const { resetVerifyEmailState } = verifyEmailSlice.actions;
export default verifyEmailSlice.reducer;
