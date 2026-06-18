import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface AdminQuickAlert {
  type: string;
  severity: "low" | "medium" | "high" | string;
  title: string;
  subtitle: string;
  message: string;
  action_label: string;
  action_path: string;
  reference_id: number;
  created_at: string;
}

export interface AdminQuickAlertsData {
  total: number;
  alerts: AdminQuickAlert[];
}

export interface AdminQuickAlertsResponse {
  success: boolean;
  message: string;
  data: AdminQuickAlertsData;
}

export interface FetchAdminQuickAlertsParams {
  limit?: number;
}

const getValidToken = (value: unknown) => {
  if (typeof value !== "string") return "";
  const token = value.trim();
  if (!token || token === "null" || token === "undefined") return "";
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

export const fetchAdminQuickAlerts = createAsyncThunk<
  AdminQuickAlertsResponse,
  FetchAdminQuickAlertsParams | undefined,
  { state: RootState; rejectValue: string }
>(
  "adminQuickAlerts/fetch",
  async (params, { rejectWithValue, getState }) => {
    try {
      const limit = Math.min(Math.max(params?.limit ?? 10, 1), 50);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const path = `/admin/quick-alerts?limit=${encodeURIComponent(String(limit))}`;
      const url = baseUrl ? `${baseUrl}${path}` : `/api/v1${path}`;
      const authHeader = getAuthToken(getState());
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authHeader) headers.Authorization = authHeader;

      const res = await fetch(url, { method: "GET", headers });
      const data = await parseApiResponse(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load quick alerts (${res.status})`);
      }

      return data as AdminQuickAlertsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching quick alerts");
    }
  }
);
