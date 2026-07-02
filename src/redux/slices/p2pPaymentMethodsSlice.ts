import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchP2PPaymentMethods, P2PPaymentMethod } from "../thunk/p2pPaymentMethodsThunk";

interface P2PPaymentMethodsState {
  loading: boolean;
  error: string | null;
  methods: P2PPaymentMethod[];
}

const initialState: P2PPaymentMethodsState = {
  loading: false,
  error: null,
  methods: [],
};

const p2pPaymentMethodsSlice = createSlice({
  name: "p2pPaymentMethods",
  initialState,
  reducers: {
    clearP2PPaymentMethodsState(state) {
      state.loading = false;
      state.error = null;
      state.methods = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchP2PPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchP2PPaymentMethods.fulfilled, (state, action: PayloadAction<P2PPaymentMethod[]>) => {
        state.loading = false;
        state.error = null;
        state.methods = action.payload;
      })
      .addCase(fetchP2PPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load payment methods";
      });
  },
});

export const { clearP2PPaymentMethodsState } = p2pPaymentMethodsSlice.actions;
export default p2pPaymentMethodsSlice.reducer;
