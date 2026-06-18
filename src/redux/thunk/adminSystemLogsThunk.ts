import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface WithdrawalFeeSetting {
  coin: string;
  amount: string;
  unit: string;
}

export interface KycLimitSetting {
  level: string;
  daily_limit: string;
  daily_unit: string;
  monthly_limit: string;
  monthly_unit: string;
}

export interface SystemLogSettings {
  trading_fee_percent: string;
  withdrawal_fees: WithdrawalFeeSetting[];
  kyc_limits: KycLimitSetting[];
}

export interface AdminSystemLogsData {
  settings: SystemLogSettings;
  updated_at: string | null;
  updated_by: number | string | null;
}

export interface AdminSystemLogsResponse {
  success: boolean;
  message: string;
  data: AdminSystemLogsData;
}

export type UpdateAdminSystemLogsPayload = SystemLogSettings;

const getValidToken = (value: unknown) => {
  if (typeof value !== "string") return "";
  const token = value.trim();
  if (!token || token === "null" || token === "undefined") {
    return "";
  }
  return token;
};

const getAuthToken = (state: RootState) => {
  const authState = state.auth;
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const storedTokenType = typeof window !== "undefined" ? localStorage.getItem("authTokenType") : null;
  const token = getValidToken(authState.token) || getValidToken(storedToken);
  const tokenType = getValidToken(authState.token_type) || getValidToken(storedTokenType) || "Bearer";

  return token ? `${tokenType} ${token}` : "";
};

const buildHeaders = (authHeader: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authHeader) {
    headers.Authorization = authHeader;
  }

  return headers;
};

const getSystemLogsUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return baseUrl ? `${baseUrl}/admin/system-logs` : "/api/v1/admin/system-logs";
};

const parseApiResponse = async (res: Response) => {
  const contentType = res.headers.get("content-type") || "";
  const rawText = await res.text();

  if (!rawText) return null;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(rawText);
    } catch {
      return { message: `Invalid JSON response from server (${res.status})` };
    }
  }

  const plainText = rawText
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    message: plainText || `Server returned a non-JSON response (${res.status})`,
  };
};

export const fetchAdminSystemLogs = createAsyncThunk<
  AdminSystemLogsResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  "adminSystemLogs/fetchSettings",
  async (_, { rejectWithValue, getState }) => {
    try {
      const res = await fetch(getSystemLogsUrl(), {
        method: "GET",
        headers: buildHeaders(getAuthToken(getState())),
      });

      const data = await parseApiResponse(res);
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load system settings (${res.status})`);
      }

      return data as AdminSystemLogsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching system settings");
    }
  }
);

export const updateAdminSystemLogs = createAsyncThunk<
  AdminSystemLogsResponse,
  UpdateAdminSystemLogsPayload,
  { state: RootState; rejectValue: string }
>(
  "adminSystemLogs/updateSettings",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const res = await fetch(getSystemLogsUrl(), {
        method: "PUT",
        headers: buildHeaders(getAuthToken(getState())),
        body: JSON.stringify(payload),
      });

      const data = await parseApiResponse(res);
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to update system settings (${res.status})`);
      }

      return data as AdminSystemLogsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while updating system settings");
    }
  }
);
