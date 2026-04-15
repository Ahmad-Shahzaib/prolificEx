import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWallets, WalletEntry, WalletsResponse } from "../thunk/walletThunk";

interface WalletState {
  loading: boolean;
  error: string | null;
  totalPortfolioUsd: number;
  wallets: WalletEntry[];
  message: string | null;
}

const initialState: WalletState = {
  loading: false,
  error: null,
  totalPortfolioUsd: 0,
  wallets: [],
  message: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletState(state) {
      state.wallets = [];
      state.totalPortfolioUsd = 0;
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        fetchWallets.fulfilled,
        (state, action: PayloadAction<WalletsResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload.message;
          state.totalPortfolioUsd = action.payload.data.total_portfolio_usd;
          state.wallets = Object.values(action.payload.data.wallets).flat();
        }
      )
      .addCase(fetchWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wallets";
      });
  },
});

export const { clearWalletState } = walletSlice.actions;
export default walletSlice.reducer;
