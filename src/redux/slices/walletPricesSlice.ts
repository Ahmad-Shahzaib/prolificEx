import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWalletPrices, WalletPricesResponse, WalletPriceItem } from "../thunk/walletPricesThunk";

interface WalletPricesState {
  loading: boolean;
  error: string | null;
  prices: Record<string, WalletPriceItem>;
  updatedAt: string | null;
  message: string | null;
}

const initialState: WalletPricesState = {
  loading: false,
  error: null,
  prices: {},
  updatedAt: null,
  message: null,
};

const walletPricesSlice = createSlice({
  name: "walletPrices",
  initialState,
  reducers: {
    clearWalletPricesState(state) {
      state.loading = false;
      state.error = null;
      state.prices = {};
      state.updatedAt = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        fetchWalletPrices.fulfilled,
        (state, action: PayloadAction<WalletPricesResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload.message;
          state.prices = action.payload.data.prices;
          state.updatedAt = action.payload.data.updated_at;
        }
      )
      .addCase(fetchWalletPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wallet prices";
      });
  },
});

export const { clearWalletPricesState } = walletPricesSlice.actions;
export default walletPricesSlice.reducer;
