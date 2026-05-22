import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWallets, convertWallet, WalletEntry, WalletsResponse, PriceData, CoinBalance } from "../thunk/walletThunk";

interface WalletState {
  loading: boolean;
  error: string | null;
  totalPortfolioUsd: number;
  wallets: WalletEntry[];
  prices: Record<string, PriceData>;
  coinBalances: Record<string, CoinBalance>;
  message: string | null;
  convertLoading: boolean;
  convertError: string | null;
  convertSuccess: boolean;
  convertMessage: string | null;
  convertResult: Record<string, any> | null;
}

const initialState: WalletState = {
  loading: false,
  error: null,
  totalPortfolioUsd: 0,
  wallets: [],
  prices: {},
  coinBalances: {},
  message: null,
  convertLoading: false,
  convertError: null,
  convertSuccess: false,
  convertMessage: null,
  convertResult: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletState(state) {
      state.wallets = [];
      state.totalPortfolioUsd = 0;
      state.prices = {};
      state.coinBalances = {};
      state.error = null;
      state.message = null;
      state.loading = false;
      state.convertLoading = false;
      state.convertError = null;
      state.convertSuccess = false;
      state.convertMessage = null;
      state.convertResult = null;
    },
    resetConvertState(state) {
      state.convertLoading = false;
      state.convertError = null;
      state.convertSuccess = false;
      state.convertMessage = null;
      state.convertResult = null;
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
          state.prices = action.payload.data.prices || {};
          state.coinBalances = action.payload.data.coin_balances || {};
          state.wallets = Object.values(action.payload.data.wallets).flat();
        }
      )
      .addCase(fetchWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wallets";
      })
      .addCase(convertWallet.pending, (state) => {
        state.convertLoading = true;
        state.convertError = null;
        state.convertSuccess = false;
        state.convertMessage = null;
      })
      .addCase(convertWallet.fulfilled, (state, action: PayloadAction<any>) => {
        state.convertLoading = false;
        state.convertError = null;
        state.convertSuccess = true;
        state.convertMessage = action.payload.message;
        state.convertResult = action.payload.data;
      })
      .addCase(convertWallet.rejected, (state, action) => {
        state.convertLoading = false;
        state.convertError = action.payload || "Conversion failed";
        state.convertSuccess = false;
        state.convertMessage = null;
      });
  },
});

export const { clearWalletState, resetConvertState } = walletSlice.actions;
export default walletSlice.reducer;
