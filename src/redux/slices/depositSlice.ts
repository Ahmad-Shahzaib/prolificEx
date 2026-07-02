import { createSlice } from "@reduxjs/toolkit";
import { fetchDepositInfo, getDepositInfoRequestKey, DepositInfoData } from "../thunk/depositThunk";

interface DepositState {
  loading: boolean;
  error: string | null;
  info: DepositInfoData | null;
  message: string | null;
  loadedAt: number | null;
  lastRequestKey: string | null;
}

const initialState: DepositState = {
  loading: false,
  error: null,
  info: null,
  message: null,
  loadedAt: null,
  lastRequestKey: null,
};

const depositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    clearDepositState(state) {
      state.loading = false;
      state.error = null;
      state.info = null;
      state.message = null;
      state.loadedAt = null;
      state.lastRequestKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepositInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepositInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.info = action.payload.data;
        state.message = action.payload.message;
        state.loadedAt = Date.now();
        state.lastRequestKey = getDepositInfoRequestKey(action.meta.arg);
      })
      .addCase(fetchDepositInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load deposit info";
      });
  },
});

export const { clearDepositState } = depositSlice.actions;
export default depositSlice.reducer;