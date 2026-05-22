import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSessions, revokeSession, SessionItem, SessionsResponse, RevokeSessionResponse } from "../thunk/sessionsThunk";

interface SessionsState {
  loading: boolean;
  error: string | null;
  revokeLoadingId: number | null;
  revokeError: string | null;
  sessions: SessionItem[];
  message: string | null;
}

const initialState: SessionsState = {
  loading: false,
  error: null,
  revokeLoadingId: null,
  revokeError: null,
  sessions: [],
  message: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    clearSessions(state) {
      state.sessions = [];
      state.loading = false;
      state.error = null;
      state.revokeLoadingId = null;
      state.revokeError = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        fetchSessions.fulfilled,
        (state, action: PayloadAction<SessionsResponse>) => {
          state.loading = false;
          state.error = null;
          state.sessions = action.payload.data;
          state.message = action.payload.message;
        }
      )
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sessions";
      })
      .addCase(revokeSession.pending, (state, action) => {
        state.revokeLoadingId = action.meta.arg.id;
        state.revokeError = null;
      })
      .addCase(
        revokeSession.fulfilled,
        (state, action: PayloadAction<RevokeSessionResponse>) => {
          state.revokeLoadingId = null;
          state.revokeError = null;
          if (action.meta.arg?.id != null) {
            state.sessions = state.sessions.filter((session) => session.id !== action.meta.arg.id);
          }
          state.message = action.payload.message;
        }
      )
      .addCase(revokeSession.rejected, (state, action) => {
        state.revokeLoadingId = null;
        state.revokeError = action.payload || "Failed to revoke session";
      });
  },
});

export const { clearSessions } = sessionsSlice.actions;
export default sessionsSlice.reducer;
