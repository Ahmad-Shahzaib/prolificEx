import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  P2POrderMessageItem,
  fetchP2POrderMessages,
  sendP2POrderMessage,
} from "../thunk/p2pOrderMessagesThunk";

interface P2POrderMessagesState {
  loading: boolean;
  sending: boolean;
  error: string | null;
  messages: P2POrderMessageItem[];
}

const initialState: P2POrderMessagesState = {
  loading: false,
  sending: false,
  error: null,
  messages: [],
};

const p2pOrderMessagesSlice = createSlice({
  name: "p2pOrderMessages",
  initialState,
  reducers: {
    clearP2POrderMessages(state) {
      state.loading = false;
      state.sending = false;
      state.error = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchP2POrderMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchP2POrderMessages.fulfilled,
        (state, action: PayloadAction<P2POrderMessageItem[]>) => {
          state.loading = false;
          state.error = null;
          state.messages = action.payload;
        }
      )
      .addCase(fetchP2POrderMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load chat messages";
      })
      .addCase(sendP2POrderMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(
        sendP2POrderMessage.fulfilled,
        (state, action: PayloadAction<P2POrderMessageItem>) => {
          state.sending = false;
          state.error = null;
          if (!Array.isArray(state.messages)) {
            state.messages = [];
          }
          state.messages.push(action.payload);
        }
      )
      .addCase(sendP2POrderMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload || "Failed to send message";
      });
  },
});

export const { clearP2POrderMessages } = p2pOrderMessagesSlice.actions;
export default p2pOrderMessagesSlice.reducer;
