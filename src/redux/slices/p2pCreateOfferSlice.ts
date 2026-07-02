import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { P2POffer } from "../thunk/p2pOffersThunk";
import { createP2POffer } from "../thunk/p2pCreateOfferThunk";

interface P2PCreateOfferState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  createdOffer: P2POffer | null;
}

const initialState: P2PCreateOfferState = {
  loading: false,
  error: null,
  successMessage: null,
  createdOffer: null,
};

const p2pCreateOfferSlice = createSlice({
  name: "p2pCreateOffer",
  initialState,
  reducers: {
    resetP2PCreateOfferState(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.createdOffer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createP2POffer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createP2POffer.fulfilled, (state, action: PayloadAction<P2POffer>) => {
        state.loading = false;
        state.error = null;
        state.successMessage = "Offer created successfully.";
        state.createdOffer = action.payload;
      })
      .addCase(createP2POffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create offer";
        state.successMessage = null;
      });
  },
});

export const { resetP2PCreateOfferState } = p2pCreateOfferSlice.actions;
export default p2pCreateOfferSlice.reducer;
