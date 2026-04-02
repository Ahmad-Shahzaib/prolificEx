import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KycPendingEntry, KycPendingData, KycPendingResponse, fetchKycPending } from "../thunk/adminKycPendingThunk";

interface AdminKycPendingState {
  loading: boolean;
  error: string | null;
  entries: KycPendingEntry[];
  pagination: KycPendingData | null;
}

const initialState: AdminKycPendingState = {
  loading: false,
  error: null,
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
      });
  },
});

export const { resetKycPendingError } = adminKycPendingSlice.actions;
export default adminKycPendingSlice.reducer;
