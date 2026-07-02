import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTwoFactorStatus,
  setupTwoFactor,
  confirmTwoFactor,
  disableTwoFactor,
  TwoFactorStatusResponse,
  TwoFactorSetupResponse,
} from "../thunk/twoFactorThunk";

interface TwoFactorState {
  loading: boolean;
  setupLoading: boolean;
  confirmLoading: boolean;
  disableLoading: boolean;
  error: string | null;
  setupError: string | null;
  confirmError: string | null;
  enabled: boolean;
  confirmedAt: string | null;
  backupCodesRemaining: number;
  message: string | null;
  setupMessage: string | null;
  confirmMessage: string | null;
  setupQrUrl: string | null;
  setupOtpAuthUrl: string | null;
  setupManualEntryKey: string | null;
  setupIssuer: string | null;
  setupAccount: string | null;
  loadedAt: number | null;
}

const initialState: TwoFactorState = {
  loading: false,
  setupLoading: false,
  confirmLoading: false,
  disableLoading: false,
  error: null,
  setupError: null,
  confirmError: null,
  enabled: false,
  confirmedAt: null,
  backupCodesRemaining: 0,
  message: null,
  setupMessage: null,
  confirmMessage: null,
  setupQrUrl: null,
  setupOtpAuthUrl: null,
  setupManualEntryKey: null,
  setupIssuer: null,
  setupAccount: null,
  loadedAt: null,
};

const twoFactorSlice = createSlice({
  name: "twoFactor",
  initialState,
  reducers: {
    clearTwoFactorStatus(state) {
      state.loading = false;
      state.error = null;
      state.enabled = false;
      state.confirmedAt = null;
      state.backupCodesRemaining = 0;
      state.message = null;
      state.loadedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTwoFactorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        fetchTwoFactorStatus.fulfilled,
        (state, action: PayloadAction<TwoFactorStatusResponse>) => {
          state.loading = false;
          state.error = null;
          state.enabled = action.payload.data.enabled;
          state.confirmedAt = action.payload.data.confirmed_at;
          state.backupCodesRemaining = action.payload.data.backup_codes_remaining;
          state.message = action.payload.message;
          state.loadedAt = Date.now();
        }
      )
      .addCase(fetchTwoFactorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch two-factor authentication status";
      })
      .addCase(setupTwoFactor.pending, (state) => {
        state.setupLoading = true;
        state.setupError = null;
        state.setupMessage = null;
      })
      .addCase(
        setupTwoFactor.fulfilled,
        (state, action: PayloadAction<TwoFactorSetupResponse>) => {
          state.setupLoading = false;
          state.setupError = null;
          state.setupMessage = action.payload.message;
          state.setupQrUrl = action.payload.data.qr_url;
          state.setupOtpAuthUrl = action.payload.data.otp_auth_url;
          state.setupManualEntryKey = action.payload.data.manual_entry_key;
          state.setupIssuer = action.payload.data.issuer;
          state.setupAccount = action.payload.data.account;
        }
      )
      .addCase(setupTwoFactor.rejected, (state, action) => {
        state.setupLoading = false;
        state.setupError = action.payload || "Failed to setup two-factor authentication";
      })
      .addCase(confirmTwoFactor.pending, (state) => {
        state.confirmLoading = true;
        state.confirmError = null;
        state.confirmMessage = null;
      })
      .addCase(confirmTwoFactor.fulfilled, (state, action) => {
        state.confirmLoading = false;
        state.confirmError = null;
        state.confirmMessage = action.payload.message;
        state.enabled = action.payload.data?.enabled ?? true;
        state.confirmedAt = action.payload.data?.confirmed_at ?? state.confirmedAt;
        state.backupCodesRemaining = action.payload.data?.backup_codes_remaining ?? state.backupCodesRemaining;
        state.loadedAt = Date.now();
      })
      .addCase(confirmTwoFactor.rejected, (state, action) => {
        state.confirmLoading = false;
        state.confirmError = action.payload || "Failed to confirm two-factor authentication";
      })
      .addCase(disableTwoFactor.pending, (state) => {
        state.disableLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(disableTwoFactor.fulfilled, (state, action) => {
        state.disableLoading = false;
        state.error = null;
        state.message = action.payload.message;
        state.enabled = action.payload.data?.enabled ?? false;
        state.confirmedAt = action.payload.data?.confirmed_at ?? null;
        state.backupCodesRemaining = action.payload.data?.backup_codes_remaining ?? state.backupCodesRemaining;
        state.setupQrUrl = null;
        state.setupOtpAuthUrl = null;
        state.setupManualEntryKey = null;
        state.setupIssuer = null;
        state.setupAccount = null;
        state.loadedAt = Date.now();
      })
      .addCase(disableTwoFactor.rejected, (state, action) => {
        state.disableLoading = false;
        state.error = action.payload || "Failed to disable two-factor authentication";
      });
  },
});

export const { clearTwoFactorStatus } = twoFactorSlice.actions;
export default twoFactorSlice.reducer;
