import { createSlice } from "@reduxjs/toolkit";
import { fetchNetworkFee, getNetworkFeeRequestKey, NetworkFeeData } from "../thunk/networkFeeThunk";

interface NetworkFeeState {
  loading: boolean;
  error: string | null;
  feeData: NetworkFeeData | null;
  message: string | null;
  loadedAt: number | null;
  lastRequestKey: string | null;
}

const initialState: NetworkFeeState = {
  loading: false,
  error: null,
  feeData: null,
  message: null,
  loadedAt: null,
  lastRequestKey: null,
};

const networkFeeSlice = createSlice({
  name: "networkFee",
  initialState,
  reducers: {
    clearNetworkFeeState(state) {
      state.loading = false;
      state.error = null;
      state.feeData = null;
      state.message = null;
      state.loadedAt = null;
      state.lastRequestKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworkFee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchNetworkFee.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.feeData = action.payload.data;
        state.loadedAt = Date.now();
        state.lastRequestKey = getNetworkFeeRequestKey(action.meta.arg);
      })
      .addCase(fetchNetworkFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch network fee";
      });
  },
});

export const { clearNetworkFeeState } = networkFeeSlice.actions;
export default networkFeeSlice.reducer;