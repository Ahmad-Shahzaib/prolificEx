import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOffer, fetchMyOffers, fetchOffers, getP2POffersRequestKey, P2POffer } from "../thunk/p2pOffersThunk";

interface P2POffersState {
  loading: boolean;
  error: string | null;
  offers: P2POffer[];
  offersLoading: boolean;
  offersError: string | null;
  myOffers: P2POffer[];
  creating: boolean;
  createError: string | null;
  createSuccessMessage: string | null;
  offersLoadedAt: number | null;
  myOffersLoadedAt: number | null;
  lastOffersRequestKey: string | null;
}

const initialState: P2POffersState = {
  loading: false,
  error: null,
  offers: [],
  offersLoading: false,
  offersError: null,
  myOffers: [],
  creating: false,
  createError: null,
  createSuccessMessage: null,
  offersLoadedAt: null,
  myOffersLoadedAt: null,
  lastOffersRequestKey: null,
};

const p2pOffersSlice = createSlice({
  name: "p2pOffers",
  initialState,
  reducers: {
    clearP2POffersState(state) {
      state.loading = false;
      state.error = null;
      state.offers = [];
      state.offersLoading = false;
      state.offersError = null;
      state.myOffers = [];
      state.creating = false;
      state.createError = null;
      state.createSuccessMessage = null;
      state.offersLoadedAt = null;
      state.myOffersLoadedAt = null;
      state.lastOffersRequestKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOffers.fulfilled, (state, action: PayloadAction<P2POffer[]>) => {
        state.loading = false;
        state.error = null;
        state.myOffers = action.payload;
        state.myOffersLoadedAt = Date.now();
      })
      .addCase(fetchMyOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load P2P offers";
      })
      .addCase(fetchOffers.pending, (state) => {
        state.offersLoading = true;
        state.offersError = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offersLoading = false;
        state.offersError = null;
        state.offers = action.payload;
        state.offersLoadedAt = Date.now();
        state.lastOffersRequestKey = getP2POffersRequestKey(action.meta.arg);
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.offersLoading = false;
        state.offersError = action.payload || "Failed to load P2P offers";
      })
      .addCase(createOffer.pending, (state) => {
        state.creating = true;
        state.createError = null;
        state.createSuccessMessage = null;
      })
      .addCase(createOffer.fulfilled, (state, action: PayloadAction<P2POffer>) => {
        state.creating = false;
        state.createError = null;
        state.createSuccessMessage = "Offer created successfully.";
        state.myOffers.unshift(action.payload);
        state.myOffersLoadedAt = Date.now();
        state.offersLoadedAt = null;
        state.lastOffersRequestKey = null;
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || "Failed to create offer";
      });
  },
});

export const { clearP2POffersState } = p2pOffersSlice.actions;
export default p2pOffersSlice.reducer;
