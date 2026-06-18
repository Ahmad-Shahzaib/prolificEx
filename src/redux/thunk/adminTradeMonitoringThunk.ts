import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface AdminTradeMonitoringUser {
  buyer_id: number;
  buyer_name: string;
  buyer_email: string;
  seller_id: number;
  seller_name: string;
  seller_email: string;
}

export interface AdminTradeMonitoringItem {
  id: number;
  trade_id: string;
  user: AdminTradeMonitoringUser;
  pair: string;
  type: "buy" | "sell" | string;
  amount: string;
  price: string;
  total: string;
  status: string;
  network: string;
  created_at: string;
  completed_at: string | null;
}

export interface AdminTradeMonitoringSummary {
  total_count: number;
  completed_count: number;
  pending_count: number;
  disputed_count: number;
}

export interface AdminTradeMonitoringData {
  summary: AdminTradeMonitoringSummary;
  current_page: number;
  data: AdminTradeMonitoringItem[];
  per_page: number;
  total: number;
}

export interface AdminTradeMonitoringResponse {
  success: boolean;
  message: string;
  data: AdminTradeMonitoringData;
}

export interface FetchAdminTradeMonitoringParams {
  search?: string;
  coin?: string;
  status?: string;
  type?: "buy" | "sell" | "";
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

const buildQuery = (params?: FetchAdminTradeMonitoringParams) => {
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

export const fetchAdminTradeMonitoring = createAsyncThunk<
  AdminTradeMonitoringResponse,
  FetchAdminTradeMonitoringParams | undefined,
  { state: RootState; rejectValue: string }
>(
  "adminTradeMonitoring/fetchList",
  async (params, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const authHeader = getAuthToken(getState());
      const query = buildQuery(params);
      const path = `/admin/trade-monitoring${query ? `?${query}` : ""}`;
      const url = baseUrl ? `${baseUrl}${path}` : `/api/v1${path}`;

      const res = await fetch(url, {
        method: "GET",
        headers: buildHeaders(authHeader),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load trade monitoring (${res.status})`);
      }

      return data as AdminTradeMonitoringResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching trade monitoring");
    }
  }
);
