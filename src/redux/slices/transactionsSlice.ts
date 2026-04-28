import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTransactions, TransactionItem, TransactionsResponse } from "../thunk/transactionsThunk";

interface TransactionsState {
  loading: boolean;
  error: string | null;
  transactions: TransactionItem[];
  message: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  filters: {
    type: string;
    coin: string;
  };
}

const initialState: TransactionsState = {
  loading: false,
  error: null,
  transactions: [],
  message: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  },
  filters: {
    type: "",
    coin: "",
  },
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionFilters(state, action: PayloadAction<{ type?: string; coin?: string }>) {
      state.filters = {
        type: action.payload.type ?? state.filters.type,
        coin: action.payload.coin ?? state.filters.coin,
      };
    },
    clearTransactionFilters(state) {
      state.filters = {
        type: "",
        coin: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<TransactionsResponse>) => {
          state.loading = false;
          state.error = null;
          state.message = action.payload.message;
          state.transactions = action.payload.data.data;
          state.pagination = {
            currentPage: action.payload.data.current_page,
            lastPage: action.payload.data.last_page,
            perPage: action.payload.data.per_page,
            total: action.payload.data.total,
          };
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transactions";
      });
  },
});

export const { setTransactionFilters, clearTransactionFilters } = transactionsSlice.actions;
export default transactionsSlice.reducer;
