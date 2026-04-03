import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, LoginResponse } from "../thunk/loginThunk";
import { logoutUser, LogoutResponse } from "../thunk/logoutThunk";

export interface UserPayload {
  uuid: string;
  full_name: string;
  email: string;
  phone: string;
  kyc_level: number;
  status: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  token: string | null;
  token_type: string | null;
  user: UserPayload | null;
  isAuthenticated: boolean;
  message: string | null;
}

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const getInitialUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserPayload;
  } catch {
    return null;
  }
};

const getInitialTokenType = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authTokenType");
};

const initialState: AuthState = {
  loading: false,
  error: null,
  token: getInitialToken(),
  token_type: getInitialTokenType(),
  user: getInitialUser(),
  isAuthenticated: !!getInitialToken(),
  message: null,
};

const clearPersistedStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.loading = false;
      state.error = null;
      state.token = null;
      state.token_type = null;
      state.user = null;
      state.isAuthenticated = false;
      state.message = null;
      clearPersistedStorage();
    },
    resetAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.data.token;
        state.token_type = action.payload.data.token_type;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", action.payload.data.token);
          localStorage.setItem("authTokenType", action.payload.data.token_type);
          localStorage.setItem("authUser", JSON.stringify(action.payload.data.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logoutUser.fulfilled, (state, action: PayloadAction<LogoutResponse>) => {
        state.loading = false;
        state.error = null;
        state.token = null;
        state.token_type = null;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
        clearPersistedStorage();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { logout, resetAuthError } = authSlice.actions;
export default authSlice.reducer;
