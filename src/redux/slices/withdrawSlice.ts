import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { withdrawThunk, WithdrawResponse } from '../thunk/withdrawThunk';

interface WithdrawState {
  loading: boolean;
  error: string | null;
  authRequired: boolean;
  success: boolean;
  message: string | null;
  data: WithdrawResponse['data'] | null;
}

const initialState: WithdrawState = {
  loading: false,
  error: null,
  authRequired: false,
  success: false,
  message: null,
  data: null,
};

const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState,
  reducers: {
    resetWithdrawState: (state) => {
      state.loading = false;
      state.error = null;
      state.authRequired = false;
      state.success = false;
      state.message = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(withdrawThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authRequired = false;
        state.success = false;
        state.message = null;
      })
      .addCase(withdrawThunk.fulfilled, (state, action: PayloadAction<WithdrawResponse>) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.data = action.payload.data;
      })
      .addCase(withdrawThunk.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload || 'Withdrawal failed';
        state.error = errorMessage;
        state.authRequired = /session|login|authorization|jwt|token/i.test(errorMessage);
        state.success = false;
      });
  },
});

export const { resetWithdrawState } = withdrawSlice.actions;
export default withdrawSlice.reducer;
