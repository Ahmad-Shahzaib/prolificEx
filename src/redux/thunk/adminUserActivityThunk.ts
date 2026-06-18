import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type AdminUserActivityRange = "1w" | "1m" | "3m" | "6m";

export interface AdminUserActivitySummary {
  total_users: number;
  active_users: number;
  suspended_users: number;
  pending_kyc: number;
  banned_users: number;
}

export interface AdminUserActivityPoint {
  timestamp: string;
  label: string;
  new_users: number;
  active_sessions: number;
  cumulative_users: number;
  value: number;
  [key: string]: string | number | null | undefined;
}

export interface AdminUserActivitySeries {
  line_key: string;
  points: AdminUserActivityPoint[];
}

export interface AdminUserActivityData {
  title: string;
  subtitle: string;
  range: AdminUserActivityRange;
  summary: AdminUserActivitySummary;
  series: AdminUserActivitySeries;
}

export interface AdminUserActivityResponse {
  success: boolean;
  message: string;
  data: AdminUserActivityData;
}

export interface FetchAdminUserActivityParams {
  range: AdminUserActivityRange;
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

export const fetchAdminUserActivity = createAsyncThunk<
  AdminUserActivityResponse,
  FetchAdminUserActivityParams,
  { state: RootState; rejectValue: string }
>(
  "adminUserActivity/fetch",
  async ({ range }, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const path = `/admin/user-activity?range=${encodeURIComponent(range)}`;
      const url = baseUrl ? `${baseUrl}${path}` : `/api/v1${path}`;
      const authHeader = getAuthToken(getState());
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authHeader) headers.Authorization = authHeader;

      const res = await fetch(url, { method: "GET", headers });
      const data = await parseApiResponse(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load user activity (${res.status})`);
      }

      return data as AdminUserActivityResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching user activity");
    }
  }
);
