import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { submitP2POrderRating, P2POrderRatingResponse } from "../thunk/p2pOrderRatingThunk";

interface P2POrderRatingState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  data: P2POrderRatingResponse | null;
}

const initialState: P2POrderRatingState = {
  loading: false,
  error: null,
  successMessage: null,
  data: null,
};

const p2pOrderRatingSlice = createSlice({
  name: "p2pOrderRating",
  initialState,
  reducers: {
    clearP2POrderRatingState(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitP2POrderRating.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitP2POrderRating.fulfilled, (state, action: PayloadAction<P2POrderRatingResponse>) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
        state.successMessage = "Counterparty rated successfully.";
      })
      .addCase(submitP2POrderRating.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        state.error = action.payload || "Failed to submit rating";
      });
  },
});

export const { clearP2POrderRatingState } = p2pOrderRatingSlice.actions;
export default p2pOrderRatingSlice.reducer;
