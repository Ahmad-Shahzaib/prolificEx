import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, LoginResponse } from "../thunk/loginThunk";
import { socialLogin } from "../thunk/socialLoginThunk";
import { verifyTwoFactorLogin } from "../thunk/verifyTwoFactorThunk";
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
  requires2fa: boolean;
  pending2faToken: string | null;
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

const getInitialPendingTwoFactorToken = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("pending2faToken");
};

const persistPendingTwoFactorToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem("pending2faToken", token);
  } else {
    sessionStorage.removeItem("pending2faToken");
  }
};

const initialState: AuthState = {
  loading: false,
  error: null,
  token: getInitialToken(),
  token_type: getInitialTokenType(),
  user: getInitialUser(),
  isAuthenticated: !!getInitialToken(),
  message: null,
  requires2fa: !!getInitialPendingTwoFactorToken(),
  pending2faToken: getInitialPendingTwoFactorToken(),
};

const clearPersistedStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
  }
};

const applyLoginResponse = (state: AuthState, payload: LoginResponse) => {
  state.loading = false;
  state.error = null;

  if ("requires_2fa" in payload.data && payload.data.requires_2fa) {
    state.requires2fa = true;
    state.pending2faToken = payload.data.pending_token;
    state.isAuthenticated = false;
    state.token = null;
    state.token_type = null;
    state.user = null;
    state.message = payload.message;
    persistPendingTwoFactorToken(payload.data.pending_token);
    return;
  }

  const successData = payload.data as {
    token: string;
    token_type: string;
    user: UserPayload;
  };

  state.token = successData.token;
  state.token_type = successData.token_type;
  state.user = successData.user;
  state.isAuthenticated = true;
  state.message = payload.message;
  state.requires2fa = false;
  state.pending2faToken = null;
  persistPendingTwoFactorToken(null);

  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", successData.token);
    localStorage.setItem("authTokenType", successData.token_type);
    localStorage.setItem("authUser", JSON.stringify(successData.user));
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
      state.requires2fa = false;
      state.pending2faToken = null;
      clearPersistedStorage();
    },
    resetAuthError(state) {
      state.error = null;
    },
    clearPendingTwoFactorLogin(state) {
      state.requires2fa = false;
      state.pending2faToken = null;
      persistPendingTwoFactorToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.requires2fa = false;
        state.pending2faToken = null;
        persistPendingTwoFactorToken(null);
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        applyLoginResponse(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.requires2fa = false;
        state.pending2faToken = null;
        persistPendingTwoFactorToken(null);
      })
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.requires2fa = false;
        state.pending2faToken = null;
        persistPendingTwoFactorToken(null);
      })
      .addCase(socialLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        applyLoginResponse(state, action.payload);
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Social login failed";
        state.isAuthenticated = false;
        state.requires2fa = false;
        state.pending2faToken = null;
        persistPendingTwoFactorToken(null);
      })
      .addCase(verifyTwoFactorLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyTwoFactorLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.requires2fa = false;
        state.pending2faToken = null;
        persistPendingTwoFactorToken(null);
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
      .addCase(verifyTwoFactorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Two-factor verification failed";
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
        state.requires2fa = false;
        state.pending2faToken = null;
        clearPersistedStorage();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { logout, resetAuthError, clearPendingTwoFactorLogin } = authSlice.actions;
export default authSlice.reducer;
