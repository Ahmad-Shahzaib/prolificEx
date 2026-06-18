import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface AdminWithdrawalResponseItem {
  id: string;
  name?: string;
  email?: string;
  coin: string;
  amount: string;
  address: string;
  status: string;
  txid?: string;
  notes?: string;
  created_at?: string;
  user?: {
    full_name?: string;
    email?: string;
  };
}

export interface AdminWithdrawalsResponse {
  success: boolean;
  message: string;
  data: AdminWithdrawalResponseItem[];
}

export interface AdminWithdrawalDetailResponse {
  success: boolean;
  message: string;
  data: AdminWithdrawalResponseItem;
}

export interface ApproveAdminWithdrawalParams {
  id: string;
  txid: string;
  notes: string;
}

export interface RejectAdminWithdrawalParams {
  id: string;
  reason: string;
}

export interface AdminWithdrawalActionResponse {
  success: boolean;
  message: string;
  withdrawalId: string;
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

export const fetchAdminWithdrawals = createAsyncThunk<
  AdminWithdrawalsResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  "adminWithdrawals/fetchList",
  async (_, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const authHeader = getAuthToken(getState());
      const url = baseUrl
        ? `${baseUrl}/admin/wallet/withdrawals`
        : "/api/v1/admin/wallet/withdrawals";

      const res = await fetch(url, {
        method: "GET",
        headers: buildHeaders(authHeader),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load withdrawals (${res.status})`);
      }

      return data as AdminWithdrawalsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching withdrawals");
    }
  }
);

export const fetchAdminWithdrawalById = createAsyncThunk<
  AdminWithdrawalDetailResponse,
  string,
  { state: RootState; rejectValue: string }
>(
  "adminWithdrawals/fetchById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const authHeader = getAuthToken(getState());
      const url = baseUrl
        ? `${baseUrl}/admin/wallet/withdrawals/${id}`
        : `/api/v1/admin/wallet/withdrawals/${id}`;

      const res = await fetch(url, {
        method: "GET",
        headers: buildHeaders(authHeader),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load withdrawal ${id} (${res.status})`);
      }

      return data as AdminWithdrawalDetailResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching withdrawal details");
    }
  }
);

export const approveAdminWithdrawal = createAsyncThunk<
  AdminWithdrawalActionResponse,
  ApproveAdminWithdrawalParams,
  { state: RootState; rejectValue: string }
>(
  "adminWithdrawals/approve",
  async ({ id, txid, notes }, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const authHeader = getAuthToken(getState());
      const url = baseUrl
        ? `${baseUrl}/admin/wallet/withdrawals/${id}/approve`
        : `/api/v1/admin/wallet/withdrawals/${id}/approve`;

      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders(authHeader),
        body: JSON.stringify({ txid, notes }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to approve withdrawal (${res.status})`);
      }

      return {
        success: data.success,
        message: data.message,
        withdrawalId: id,
      } as AdminWithdrawalActionResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while approving withdrawal");
    }
  }
);

export const rejectAdminWithdrawal = createAsyncThunk<
  AdminWithdrawalActionResponse,
  RejectAdminWithdrawalParams,
  { state: RootState; rejectValue: string }
>(
  "adminWithdrawals/reject",
  async ({ id, reason }, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const authHeader = getAuthToken(getState());
      const url = baseUrl
        ? `${baseUrl}/admin/wallet/withdrawals/${id}/reject`
        : `/api/v1/admin/wallet/withdrawals/${id}/reject`;

      const res = await fetch(url, {
        method: "POST",
        headers: buildHeaders(authHeader),
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to reject withdrawal (${res.status})`);
      }

      return {
        success: data.success,
        message: data.message,
        withdrawalId: id,
      } as AdminWithdrawalActionResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while rejecting withdrawal");
    }
  }
);
