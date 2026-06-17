import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminWithdrawalResponseItem,
  AdminWithdrawalsResponse,
  fetchAdminWithdrawals,
  fetchAdminWithdrawalById,
  approveAdminWithdrawal,
  rejectAdminWithdrawal,
} from "../thunk/adminWithdrawalsThunk";

export interface AdminWithdrawalEntry {
  id: string;
  name: string;
  email: string;
  coin: string;
  amount: string;
  address: string;
  status: string;
  txid?: string;
  notes?: string;
  requested_at?: string;
}

interface AdminWithdrawalsState {
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;
  actionMessage: string | null;
  entries: AdminWithdrawalEntry[];
  selectedWithdrawal: AdminWithdrawalEntry | null;
}

const initialState: AdminWithdrawalsState = {
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  actionMessage: null,
  entries: [],
  selectedWithdrawal: null,
};

const normalizeWithdrawal = (item: AdminWithdrawalResponseItem): AdminWithdrawalEntry => ({
  id: String(item.id),
  name: item.name || item.user?.full_name || "Unknown",
  email: item.email || item.user?.email || "",
  coin: item.coin,
  amount: item.amount,
  address: item.address,
  status: item.status || "pending",
  txid: item.txid,
  notes: item.notes,
  requested_at: item.created_at,
});

const extractWithdrawalList = (payload: AdminWithdrawalsResponse): AdminWithdrawalResponseItem[] => {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.data && Array.isArray((payload.data as any).data)) {
    return (payload.data as any).data;
  }

  return [];
};

const adminWithdrawalsSlice = createSlice({
  name: "adminWithdrawals",
  initialState,
  reducers: {
    resetAdminWithdrawalsError(state) {
      state.error = null;
      state.actionError = null;
      state.actionMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminWithdrawals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminWithdrawals.fulfilled, (state, action: PayloadAction<AdminWithdrawalsResponse>) => {
        state.loading = false;
        state.error = null;
        state.entries = extractWithdrawalList(action.payload).map(normalizeWithdrawal);
      })
      .addCase(fetchAdminWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load withdrawals";
      })

      .addCase(fetchAdminWithdrawalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminWithdrawalById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.selectedWithdrawal = normalizeWithdrawal(action.payload.data);
      })
      .addCase(fetchAdminWithdrawalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load withdrawal details";
      })

      .addCase(approveAdminWithdrawal.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionMessage = null;
      })
      .addCase(approveAdminWithdrawal.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionMessage = action.payload.message;
        const idx = state.entries.findIndex((entry) => entry.id === action.payload.withdrawalId);
        if (idx >= 0) {
          state.entries[idx].status = "approved";
        }
      })
      .addCase(approveAdminWithdrawal.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Failed to approve withdrawal";
      })

      .addCase(rejectAdminWithdrawal.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionMessage = null;
      })
      .addCase(rejectAdminWithdrawal.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionMessage = action.payload.message;
        const idx = state.entries.findIndex((entry) => entry.id === action.payload.withdrawalId);
        if (idx >= 0) {
          state.entries[idx].status = "rejected";
        }
      })
      .addCase(rejectAdminWithdrawal.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Failed to reject withdrawal";
      });
  },
});

export const { resetAdminWithdrawalsError } = adminWithdrawalsSlice.actions;
export default adminWithdrawalsSlice.reducer;
