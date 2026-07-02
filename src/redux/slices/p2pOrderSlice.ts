import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  initiateP2POrder,
  P2POrderResponseData,
  P2PDisputeResponseData,
  submitP2PPaymentProof,
  P2PPaymentProofResponseData,
  disputeP2POrder,
} from "../thunk/p2pOrderThunk";

interface P2POrderState {
  loading: boolean;
  error: string | null;
  order: P2POrderResponseData | null;
  successMessage: string | null;
  paymentProofLoading: boolean;
  paymentProofError: string | null;
  paymentProofSuccessMessage: string | null;
  disputeLoading: boolean;
  disputeError: string | null;
  disputeSuccessMessage: string | null;
}

const initialState: P2POrderState = {
  loading: false,
  error: null,
  order: null,
  successMessage: null,
  paymentProofLoading: false,
  paymentProofError: null,
  paymentProofSuccessMessage: null,
  disputeLoading: false,
  disputeError: null,
  disputeSuccessMessage: null,
};

const p2pOrderSlice = createSlice({
  name: "p2pOrder",
  initialState,
  reducers: {
    clearP2POrderState(state) {
      state.loading = false;
      state.error = null;
      state.order = null;
      state.successMessage = null;
      state.paymentProofLoading = false;
      state.paymentProofError = null;
      state.paymentProofSuccessMessage = null;
      state.disputeLoading = false;
      state.disputeError = null;
      state.disputeSuccessMessage = null;
    },
    restoreP2POrderState(state, action: PayloadAction<P2POrderState>) {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.order = action.payload.order;
      state.successMessage = action.payload.successMessage;
      state.paymentProofLoading = false;
      state.paymentProofError = null;
      state.paymentProofSuccessMessage = null;
      state.disputeLoading = false;
      state.disputeError = null;
      state.disputeSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateP2POrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(initiateP2POrder.fulfilled, (state, action: PayloadAction<P2POrderResponseData>) => {
        state.loading = false;
        state.error = null;
        state.order = action.payload;
        state.successMessage = "Order created successfully. Complete payment to finish the trade.";
      })
      .addCase(initiateP2POrder.rejected, (state, action) => {
        state.loading = false;
        state.order = null;
        state.successMessage = null;
        state.error = action.payload || "Failed to create order";
      })
      .addCase(submitP2PPaymentProof.pending, (state) => {
        state.paymentProofLoading = true;
        state.paymentProofError = null;
        state.paymentProofSuccessMessage = null;
      })
      .addCase(
        submitP2PPaymentProof.fulfilled,
        (state, action: PayloadAction<P2PPaymentProofResponseData>) => {
          state.paymentProofLoading = false;
          state.paymentProofError = null;
          state.paymentProofSuccessMessage = "Payment marked as paid. Waiting for seller confirmation.";
          if (state.order) {
            state.order = {
              ...state.order,
              order: {
                ...state.order.order,
                ...action.payload,
              } as any,
            } as P2POrderResponseData;
          } else {
            state.order = {
              order: action.payload as any,
              payment_info: {
                bank_name: "",
                account_name: "",
                account_number: "",
                instructions: "",
                fiat_amount: "",
                fiat_currency: "",
                payment_method: "",
                expires_at: "",
              },
            } as P2POrderResponseData;
          }
        }
      )
      .addCase(submitP2PPaymentProof.rejected, (state, action) => {
        state.paymentProofLoading = false;
        state.paymentProofSuccessMessage = null;
        state.paymentProofError = action.payload || "Failed to submit payment proof";
      })
      .addCase(disputeP2POrder.pending, (state) => {
        state.disputeLoading = true;
        state.disputeError = null;
        state.disputeSuccessMessage = null;
      })
      .addCase(disputeP2POrder.fulfilled, (state, action: PayloadAction<P2PDisputeResponseData>) => {
        state.disputeLoading = false;
        state.disputeError = null;
        state.disputeSuccessMessage = "Dispute submitted successfully. Support will review your order.";
        if (state.order) {
          state.order = {
            ...state.order,
            order: {
              ...state.order.order,
              ...action.payload,
            } as any,
          } as P2POrderResponseData;
        }
      })
      .addCase(disputeP2POrder.rejected, (state, action) => {
        state.disputeLoading = false;
        state.disputeSuccessMessage = null;
        state.disputeError = action.payload || "Failed to submit dispute";
      });
  },
});

export const { clearP2POrderState, restoreP2POrderState } = p2pOrderSlice.actions;
export default p2pOrderSlice.reducer;
