import { createAsyncThunk } from "@reduxjs/toolkit";

export interface TwoFactorStatus {
  enabled: boolean;
  confirmed_at: string | null;
  backup_codes_remaining: number;
}

export interface TwoFactorStatusResponse {
  success: boolean;
  message: string;
  data: TwoFactorStatus;
}

export interface TwoFactorSetupResponse {
  success: boolean;
  message: string;
  data: {
    secret: string;
    manual_entry_key: string;
    otp_auth_url: string;
    qr_url: string;
    issuer: string;
    account: string;
  };
}

export interface TwoFactorConfirmPayload {
  code: string;
}

export interface TwoFactorConfirmResponse {
  success: boolean;
  message: string;
  data?: {
    enabled?: boolean;
    confirmed_at?: string | null;
    backup_codes_remaining?: number;
  };
}

export interface TwoFactorDisablePayload {
  code: string;
}

export interface TwoFactorDisableResponse {
  success: boolean;
  message: string;
  data?: {
    enabled?: boolean;
    confirmed_at?: string | null;
    backup_codes_remaining?: number;
  };
}

const parseJsonSafe = async (res: Response) => {
  const text = await res.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error(`Invalid JSON response from ${res.url} (status ${res.status}): ${text.slice(0, 200)}`);
  }
};

export const fetchTwoFactorStatus = createAsyncThunk<
  TwoFactorStatusResponse,
  void,
  { rejectValue: string }
>(
  "twoFactor/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/2fa/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch 2FA status (${res.status})`);
      }

      return data as TwoFactorStatusResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching 2FA status");
    }
  }
);

export const setupTwoFactor = createAsyncThunk<
  TwoFactorSetupResponse,
  void,
  { rejectValue: string }
>(
  "twoFactor/setup",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/2fa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to setup 2FA (${res.status})`);
      }

      return data as TwoFactorSetupResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while setting up 2FA");
    }
  }
);

export const confirmTwoFactor = createAsyncThunk<
  TwoFactorConfirmResponse,
  TwoFactorConfirmPayload,
  { rejectValue: string }
>(
  "twoFactor/confirm",
  async ({ code }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/2fa/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code }),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to confirm 2FA (${res.status})`);
      }

      return data as TwoFactorConfirmResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while confirming 2FA");
    }
  }
);

export const disableTwoFactor = createAsyncThunk<
  TwoFactorDisableResponse,
  TwoFactorDisablePayload,
  { rejectValue: string }
>(
  "twoFactor/disable",
  async ({ code }, { rejectWithValue }) => {
    if (!code || !code.trim()) {
      return rejectWithValue("The code field is required.");
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/2fa/disable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code }),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to disable 2FA (${res.status})`);
      }

      return data as TwoFactorDisableResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while disabling 2FA");
    }
  }
);
