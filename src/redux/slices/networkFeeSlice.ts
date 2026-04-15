import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNetworkFee, NetworkFeeData, NetworkFeeResponse } from "../thunk/networkFeeThunk";

interface NetworkFeeState {
  loading: boolean;
  error: string | null;
  feeData: NetworkFeeData | null;
  message: string | null;
}

const initialState: NetworkFeeState = {
  loading: false,
  error: null,
  feeData: null,
  message: null,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworkFee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        fetchNetworkFee.fulfilled,
        (state, action: PayloadAction<NetworkFeeResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload.message;
          state.feeData = action.payload.data;
        }
      )
      .addCase(fetchNetworkFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch network fee";
      });
  },
});

export const { clearNetworkFeeState } = networkFeeSlice.actions;
export default networkFeeSlice.reducer;
