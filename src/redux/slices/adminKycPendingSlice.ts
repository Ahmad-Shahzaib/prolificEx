import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  KycPendingEntry,
  KycPendingData,
  KycPendingResponse,
  fetchKycPending,
  approveKyc,
  rejectKyc,
} from "../thunk/adminKycPendingThunk";

interface AdminKycPendingState {
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionMessage: string | null;
  entries: KycPendingEntry[];
  pagination: KycPendingData | null;
}

const initialState: AdminKycPendingState = {
  loading: false,
  actionLoading: false,
  error: null,
  actionMessage: null,
  entries: [],
  pagination: null,
};

const adminKycPendingSlice = createSlice({
  name: "adminKycPending",
  initialState,
  reducers: {
    resetKycPendingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKycPending.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchKycPending.fulfilled,
        (state, action: PayloadAction<KycPendingResponse>) => {
          state.loading = false;
          state.error = null;
          state.entries = action.payload.data.data;
          state.pagination = action.payload.data;
        }
      )
      .addCase(fetchKycPending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load pending KYC submissions";
      })

      .addCase(approveKyc.pending, (state) => {
        state.actionLoading = true;
        state.actionMessage = null;
        state.error = null;
      })
      .addCase(approveKyc.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionMessage = action.payload.message;

        // optimistic update to KYC status if entry exists
        const idx = state.entries.findIndex((entry) => entry.id === action.payload.kyc_id);
        if (idx >= 0) {
          state.entries[idx] = {
            ...state.entries[idx],
            status: "approved",
            reviewed_at: new Date().toISOString(),
          };
        }
      })
      .addCase(approveKyc.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to approve KYC";
      })

      .addCase(rejectKyc.pending, (state) => {
        state.actionLoading = true;
        state.actionMessage = null;
        state.error = null;
      })
      .addCase(rejectKyc.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionMessage = action.payload.message;

        const idx = state.entries.findIndex((entry) => entry.id === action.payload.kyc_id);
        if (idx >= 0) {
          state.entries[idx] = {
            ...state.entries[idx],
            status: "rejected",
            reviewed_at: new Date().toISOString(),
          };
        }
      })
      .addCase(rejectKyc.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to reject KYC";
      });
  },
});

export const { resetKycPendingError } = adminKycPendingSlice.actions;
export default adminKycPendingSlice.reducer;
