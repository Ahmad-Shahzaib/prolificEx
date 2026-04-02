import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { submitKyc, fetchKycStatus, KycSubmitResponse, KycStatusResponse } from "../thunk/kycThunk";

interface KycState {
  loading: boolean;
  statusLoading: boolean;
  error: string | null;
  statusError: string | null;
  success: boolean;
  message: string | null;
  kycId: number | null;
  status: string | null;
  kycLevel: number | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
}

const initialState: KycState = {
  loading: false,
  statusLoading: false,
  error: null,
  statusError: null,
  success: false,
  message: null,
  kycId: null,
  status: null,
  kycLevel: null,
  submittedAt: null,
  reviewedAt: null,
  reviewNotes: null,
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    resetKycState: (state) => {
      state.loading = false;
      state.statusLoading = false;
      state.error = null;
      state.statusError = null;
      state.success = false;
      state.message = null;
      state.kycId = null;
      state.status = null;
      state.kycLevel = null;
      state.submittedAt = null;
      state.reviewedAt = null;
      state.reviewNotes = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.kycId = null;
        state.status = null;
      })
      .addCase(submitKyc.fulfilled, (state, action: PayloadAction<KycSubmitResponse>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.kycId = action.payload.data.kyc_id;
        state.status = action.payload.data.status;
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "KYC submission failed";
        state.success = false;
      })
      .addCase(fetchKycStatus.pending, (state) => {
        state.statusLoading = true;
        state.statusError = null;
      })
      .addCase(fetchKycStatus.fulfilled, (state, action: PayloadAction<KycStatusResponse>) => {
        state.statusLoading = false;
        state.statusError = null;
        state.message = action.payload.message;
        state.status = action.payload.data.status;
        state.kycLevel = action.payload.data.kyc_level;
        state.submittedAt = action.payload.data.submitted_at;
        state.reviewedAt = action.payload.data.reviewed_at;
        state.reviewNotes = action.payload.data.review_notes;
      })
      .addCase(fetchKycStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.statusError = action.payload || "Failed to fetch KYC status";
      });
  },
});

export const { resetKycState } = kycSlice.actions;
export default kycSlice.reducer;
