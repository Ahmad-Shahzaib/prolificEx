import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { submitSupportTicket, SubmitTicketResponse, TicketData } from "../thunk/supportThunk";

interface SupportState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  ticket: TicketData | null;
}

const initialState: SupportState = {
  loading: false,
  error: null,
  success: false,
  message: null,
  ticket: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    resetSupportState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
      state.ticket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSupportTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.ticket = null;
      })
      .addCase(
        submitSupportTicket.fulfilled,
        (state, action: PayloadAction<SubmitTicketResponse>) => {
          state.loading = false;
          state.error = null;
          state.success = true;
          state.message = action.payload.message;
          state.ticket = action.payload.data;
        }
      )
      .addCase(submitSupportTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit support ticket";
        state.success = false;
      });
  },
});

export const { resetSupportState } = supportSlice.actions;
export default supportSlice.reducer;
