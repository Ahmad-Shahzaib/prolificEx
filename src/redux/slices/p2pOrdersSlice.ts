import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cancelOrderPayment, confirmOrderPayment, fetchMyOrders, fetchP2POrder, P2POrderItem, P2POrdersResponse } from "../thunk/p2pOrdersThunk";

interface P2POrdersState {
  loading: boolean;
  confirmLoading: boolean;
  confirmingOrderId: number | null;
  cancelLoading: boolean;
  cancellingOrderId: number | null;
  error: string | null;
  confirmError: string | null;
  cancelError: string | null;
  orders: P2POrderItem[];
  message: string | null;
  confirmMessage: string | null;
  cancelMessage: string | null;
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
  confirmLoading: false,
  confirmingOrderId: null,
  cancelLoading: false,
  cancellingOrderId: null,
  error: null,
  confirmError: null,
  cancelError: null,
  orders: [],
  message: null,
  confirmMessage: null,
  cancelMessage: null,
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
        state.orders = []; // Clear existing orders when fetching new ones
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
      })
      .addCase(fetchP2POrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchP2POrder.fulfilled, (state, action: PayloadAction<P2POrderItem>) => {
        state.loading = false;
        state.error = null;
        const fetchedOrder = action.payload;
        const orderIndex = state.orders.findIndex((item) => item.id === fetchedOrder.id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = {
            ...state.orders[orderIndex],
            ...fetchedOrder,
          };
        } else {
          state.orders.push(fetchedOrder);
        }
      })
      .addCase(fetchP2POrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch order";
      })
      .addCase(confirmOrderPayment.pending, (state, action) => {
        state.confirmLoading = true;
        state.confirmingOrderId = action.meta.arg.order_id;
        state.confirmError = null;
        state.confirmMessage = null;
      })
      .addCase(confirmOrderPayment.fulfilled, (state, action) => {
        state.confirmLoading = false;
        state.confirmingOrderId = null;
        state.confirmError = null;
        state.confirmMessage = action.payload.message;

        const updatedOrder = action.payload.data;
        const orderIndex = state.orders.findIndex((item) => item.id === updatedOrder.id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = {
            ...state.orders[orderIndex],
            ...updatedOrder,
          };
        }
      })
      .addCase(confirmOrderPayment.rejected, (state, action) => {
        state.confirmLoading = false;
        state.confirmingOrderId = null;
        state.confirmError = action.payload || "Failed to confirm payment";
      })
      .addCase(cancelOrderPayment.pending, (state, action) => {
        state.cancelLoading = true;
        state.cancellingOrderId = action.meta.arg.order_id;
        state.cancelError = null;
        state.cancelMessage = null;
      })
      .addCase(cancelOrderPayment.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.cancellingOrderId = null;
        state.cancelError = null;
        state.cancelMessage = action.payload.message;

        const updatedOrderIndex = state.orders.findIndex((item) => item.id === action.meta.arg.order_id);
        if (updatedOrderIndex !== -1) {
          const existingOrder = state.orders[updatedOrderIndex];
          state.orders[updatedOrderIndex] = {
            ...existingOrder,
            status: action.payload.data.status,
            payment_attempts: action.payload.data.payment_attempts,
            last_payment_rejection_reason: action.payload.data.last_payment_rejection_reason,
            payment_rejected_at: action.payload.data.payment_rejected_at,
          } as P2POrderItem;
        }
      })
      .addCase(cancelOrderPayment.rejected, (state, action) => {
        state.cancelLoading = false;
        state.cancellingOrderId = null;
        state.cancelError = action.payload || "Failed to report payment not received";
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
