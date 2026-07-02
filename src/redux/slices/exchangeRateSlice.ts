import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExchangeRateResult, fetchExchangeRate } from "../thunk/exchangeRateThunk";

interface ExchangeRateState {
  loading: boolean;
  error: string | null;
  base: string;
  target: string;
  rate: number | null;
}

const initialState: ExchangeRateState = {
  loading: false,
  error: null,
  base: "USD",
  target: "USD",
  rate: null,
};

const exchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState,
  reducers: {
    clearExchangeRateState(state) {
      state.loading = false;
      state.error = null;
      state.base = "USD";
      state.target = "USD";
      state.rate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRate.fulfilled, (state, action: PayloadAction<ExchangeRateResult>) => {
        state.loading = false;
        state.error = null;
        state.base = action.payload.base;
        state.target = action.payload.target;
        state.rate = action.payload.rate;
      })
      .addCase(fetchExchangeRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load exchange rate";
      });
  },
});

export const { clearExchangeRateState } = exchangeRateSlice.actions;
export default exchangeRateSlice.reducer;
