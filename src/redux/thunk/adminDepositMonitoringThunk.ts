import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface AdminDepositMonitoringUser {
  id: number;
  name: string;
  email: string;
}

export interface AdminDepositMonitoringItem {
  id: number;
  reference: string;
  user: AdminDepositMonitoringUser;
  coin: string;
  coin_label: string;
  network: string;
  amount: string;
  fee: string;
  tx_hash: string | null;
  status: string;
  confirmations: number;
  created_at: string;
  completed_at: string | null;
}

export interface AdminDepositMonitoringSummary {
  total_count: number;
  pending_count: number;
  completed_count: number;
}

export interface AdminDepositMonitoringData {
  summary: AdminDepositMonitoringSummary;
  current_page: number;
  data: AdminDepositMonitoringItem[];
  per_page: number;
  total: number;
}

export interface AdminDepositMonitoringResponse {
  success: boolean;
  message: string;
  data: AdminDepositMonitoringData;
}

export interface FetchAdminDepositMonitoringParams {
  search?: string;
  coin?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

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

const buildQuery = (params?: FetchAdminDepositMonitoringParams) => {
  const query = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  if (!query.has("per_page")) {
    query.set("per_page", "20");
  }

  return query.toString();
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

  return {
    message:
      rawText
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim() || `Server returned a non-JSON response (${res.status})`,
  };
};

export const fetchAdminDepositMonitoring = createAsyncThunk<
  AdminDepositMonitoringResponse,
  FetchAdminDepositMonitoringParams | undefined,
  { state: RootState; rejectValue: string }
>(
  "adminDepositMonitoring/fetchList",
  async (params, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const query = buildQuery(params);
      const path = `/admin/deposit-monitoring${query ? `?${query}` : ""}`;
      const url = baseUrl ? `${baseUrl}${path}` : `/api/v1${path}`;

      const res = await fetch(url, {
        method: "GET",
        headers: buildHeaders(getAuthToken(getState())),
      });

      const data = await parseApiResponse(res);
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load deposit monitoring (${res.status})`);
      }

      return data as AdminDepositMonitoringResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching deposit monitoring");
    }
  }
);
