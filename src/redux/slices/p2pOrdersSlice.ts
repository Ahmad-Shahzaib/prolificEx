import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMyOrders, P2POrderItem, P2POrdersResponse } from "../thunk/p2pOrdersThunk";

interface P2POrdersState {
  loading: boolean;
  error: string | null;
  orders: P2POrderItem[];
  message: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  statusFilter: string;
}

const initialState: P2POrdersState = {
  loading: false,
  error: null,
  orders: [],
  message: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  },
  statusFilter: "all",
};

const p2pOrdersSlice = createSlice({
  name: "p2pOrders",
  initialState,
  reducers: {
    setOrdersStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
    },
    setOrderUnreadMessages(state, action: PayloadAction<{ orderId: number; count: number }>) {
      const order = state.orders.find((item) => item.id === action.payload.orderId);
      if (order) {
        order.unread_messages = action.payload.count;
      }
    },
    incrementOrderUnreadMessages(state, action: PayloadAction<{ orderId: number; increment?: number }>) {
      const order = state.orders.find((item) => item.id === action.payload.orderId);
      if (order) {
        order.unread_messages = (order.unread_messages ?? 0) + (action.payload.increment ?? 1);
      }
    },
    clearOrders(state) {
      state.orders = [];
      state.error = null;
      state.message = null;
      state.pagination = {
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0,
      };
      state.statusFilter = "all";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action: PayloadAction<P2POrdersResponse>) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.orders = action.payload.data.data;
        state.pagination = {
          currentPage: action.payload.data.current_page,
          lastPage: action.payload.data.last_page,
          perPage: action.payload.data.per_page,
          total: action.payload.data.total,
        };
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      });
  },
});

export const {
  setOrdersStatusFilter,
  setOrderUnreadMessages,
  incrementOrderUnreadMessages,
  clearOrders,
} = p2pOrdersSlice.actions;
export default p2pOrdersSlice.reducer;
