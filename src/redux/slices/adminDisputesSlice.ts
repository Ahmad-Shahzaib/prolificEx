import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Dispute,
  DisputesData,
  DisputesResponse,
  fetchAdminDisputes,
  resolveDispute,
} from "../thunk/adminDisputesThunk";

interface AdminDisputesState {
  loading: boolean;
  error: string | null;
  resolveLoading: boolean;
  resolveError: string | null;
  disputes: Dispute[];
  pagination: DisputesData | null;
  selectedDispute: Dispute | null;
}

const initialState: AdminDisputesState = {
  loading: false,
  error: null,
  resolveLoading: false,
  resolveError: null,
  disputes: [],
  pagination: null,
  selectedDispute: null,
};

const adminDisputesSlice = createSlice({
  name: "adminDisputes",
  initialState,
  reducers: {
    resetAdminDisputesError(state) {
      state.error = null;
    },
    resetResolveError(state) {
      state.resolveError = null;
    },
    selectDispute(state, action: PayloadAction<Dispute>) {
      state.selectedDispute = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminDisputes.fulfilled,
        (state, action: PayloadAction<DisputesResponse>) => {
          state.loading = false;
          state.error = null;
          state.disputes = action.payload.data.data;
          state.pagination = action.payload.data;
          if (action.payload.data.data.length > 0 && !state.selectedDispute) {
            state.selectedDispute = action.payload.data.data[0];
          }
        }
      )
      .addCase(fetchAdminDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load disputes";
      })
      .addCase(resolveDispute.pending, (state) => {
        state.resolveLoading = true;
        state.resolveError = null;
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.resolveLoading = false;
        state.resolveError = null;
        // Remove the resolved dispute from the list
        const { disputeId } = action.meta.arg;
        state.disputes = state.disputes.filter((d) => String(d.id) !== String(disputeId));
        // If the resolved dispute was selected, select the next one
        if (state.selectedDispute && String(state.selectedDispute.id) === String(disputeId)) {
          state.selectedDispute = state.disputes.length > 0 ? state.disputes[0] : null;
        }
      })
      .addCase(resolveDispute.rejected, (state, action) => {
        state.resolveLoading = false;
        state.resolveError = action.payload || "Failed to resolve dispute";
      });
  },
});

export const { resetAdminDisputesError, resetResolveError, selectDispute } = adminDisputesSlice.actions;
export default adminDisputesSlice.reducer;
