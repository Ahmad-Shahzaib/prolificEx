import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchP2PPaymentMethods, getP2PPaymentMethodsRequestKey, P2PPaymentMethod } from "../thunk/p2pPaymentMethodsThunk";

interface P2PPaymentMethodsState {
  loading: boolean;
  error: string | null;
  methods: P2PPaymentMethod[];
  loadedAt: number | null;
  lastRequestKey: string | null;
}

const initialState: P2PPaymentMethodsState = {
  loading: false,
  error: null,
  methods: [],
  loadedAt: null,
  lastRequestKey: null,
};

const p2pPaymentMethodsSlice = createSlice({
  name: "p2pPaymentMethods",
  initialState,
  reducers: {
    clearP2PPaymentMethodsState(state) {
      state.loading = false;
      state.error = null;
      state.methods = [];
      state.loadedAt = null;
      state.lastRequestKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchP2PPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchP2PPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.methods = action.payload;
        state.loadedAt = Date.now();
        state.lastRequestKey = getP2PPaymentMethodsRequestKey(action.meta.arg);
      })
      .addCase(fetchP2PPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load payment methods";
      });
  },
});

export const { clearP2PPaymentMethodsState } = p2pPaymentMethodsSlice.actions;
export default p2pPaymentMethodsSlice.reducer;
