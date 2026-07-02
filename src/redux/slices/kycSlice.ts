import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  startKyc,
  submitKyc,
  fetchKycStatus,
  fetchKycDocuments,
  KycStartResponse,
  KycStatusResponse,
  KycDocumentsResponse,
} from "../thunk/kycThunk";

interface KycState {
  loading: boolean;
  statusLoading: boolean;
  documentsLoading: boolean;
  error: string | null;
  statusError: string | null;
  documentsError: string | null;
  success: boolean;
  message: string | null;
  kycId: number | null;
  status: string | null;
  providerStatus: string | null;
  provider: string | null;
  kycLevel: number | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  verificationUrl: string | null;
  sessionId: string | null;
  verifiedAt: string | null;
}

const initialState: KycState = {
  loading: false,
  statusLoading: false,
  documentsLoading: false,
  error: null,
  statusError: null,
  documentsError: null,
  success: false,
  message: null,
  kycId: null,
  status: null,
  providerStatus: null,
  provider: null,
  kycLevel: null,
  submittedAt: null,
  reviewedAt: null,
  reviewNotes: null,
  verificationUrl: null,
  sessionId: null,
  verifiedAt: null,
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    resetKycState: (state) => {
      state.loading = false;
      state.statusLoading = false;
      state.documentsLoading = false;
      state.error = null;
      state.statusError = null;
      state.documentsError = null;
      state.success = false;
      state.message = null;
      state.kycId = null;
      state.status = null;
      state.providerStatus = null;
      state.provider = null;
      state.kycLevel = null;
      state.submittedAt = null;
      state.reviewedAt = null;
      state.reviewNotes = null;
      state.verificationUrl = null;
      state.sessionId = null;
      state.verifiedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.kycId = null;
        state.verificationUrl = null;
        state.sessionId = null;
      })
      .addCase(startKyc.fulfilled, (state, action: PayloadAction<KycStartResponse>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.status = action.payload.data.kyc_status;
        state.verificationUrl = action.payload.data.verification_url;
        state.sessionId = action.payload.data.session_id;
      })
      .addCase(startKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to start KYC verification";
        state.success = false;
      })
      .addCase(submitKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.kycId = null;
        state.verificationUrl = null;
        state.sessionId = null;
      })
      .addCase(submitKyc.fulfilled, (state, action: PayloadAction<KycStartResponse>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.status = action.payload.data.kyc_status;
        state.verificationUrl = action.payload.data.verification_url;
        state.sessionId = action.payload.data.session_id;
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to submit KYC verification";
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
        state.providerStatus = action.payload.data.provider_status;
        state.provider = action.payload.data.provider;
        state.kycLevel = action.payload.data.kyc_level;
        state.submittedAt = action.payload.data.submitted_at;
        state.reviewedAt = action.payload.data.reviewed_at;
        state.reviewNotes = action.payload.data.review_notes;
        state.verificationUrl = action.payload.data.verification_url;
        state.sessionId = action.payload.data.session_id;
        state.verifiedAt = action.payload.data.kyc_verified_at;
      })
      .addCase(fetchKycStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.statusError = action.payload || "Failed to fetch KYC status";
        state.status = state.status ?? "not_started";
      })
      .addCase(fetchKycDocuments.pending, (state) => {
        state.documentsLoading = true;
        state.documentsError = null;
      })
      .addCase(fetchKycDocuments.fulfilled, (state, action: PayloadAction<KycDocumentsResponse>) => {
        state.documentsLoading = false;
        state.documentsError = null;
        state.provider = action.payload.data.provider;
        state.providerStatus = action.payload.data.provider_status;
        state.verificationUrl = state.verificationUrl ?? action.payload.data.verification_url;
        state.submittedAt = state.submittedAt ?? action.payload.data.submitted_at;
      })
      .addCase(fetchKycDocuments.rejected, (state, action) => {
        state.documentsLoading = false;
        state.documentsError = action.payload || "Failed to fetch KYC documents";
      });
  },
});

export const { resetKycState } = kycSlice.actions;
export default kycSlice.reducer;
