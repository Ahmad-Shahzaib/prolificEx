import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AdminUser {
  id: number;
  uuid: string;
  full_name: string;
  username: string | null;
  email: string;
  phone: string;
  avatar: string | null;
  country: string;
  status: string;
  role: string;
  kyc_level: number;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUsersData {
  current_page: number;
  data: AdminUser[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; page: number | null; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: AdminUsersData;
}

export interface FetchAdminUsersParams {
  status?: string;
  kyc_level?: number;
  search?: string;
  per_page?: number;
  page?: number;
}

export const fetchAdminUsers = createAsyncThunk<
  AdminUsersResponse,
  FetchAdminUsersParams | undefined,
  { rejectValue: string }
>(
  "adminUsers/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const query = new URLSearchParams();
      if (params?.status) query.append("status", params.status);
      if (typeof params?.kyc_level !== "undefined") query.append("kyc_level", String(params.kyc_level));
      if (params?.search) query.append("search", params.search);
      if (params?.per_page) query.append("per_page", String(params.per_page));
      if (params?.page) query.append("page", String(params.page));

      const url = `${baseUrl}/admin/users${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch users");
      }

      return data as AdminUsersResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching users");
    }
  }
);

export interface UpdateAdminUserStatusParams {
  userId: number;
  status: "active" | "suspended";
}

export interface UpdateAdminUserStatusResponse {
  success: boolean;
  message: string;
  data?: {
    status: string;
  };
}

export const updateAdminUserStatus = createAsyncThunk<
  UpdateAdminUserStatusResponse,
  UpdateAdminUserStatusParams,
  { rejectValue: string }
>(
  "adminUsers/updateStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      /*
        As per user request, this endpoint uses PUT and is intended as:
            /admin/user-management/{id}
        payload { status: "active" | "suspend" }
      */
      const url = `${baseUrl}/admin/users/${userId}/status`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to update user status");
      }

      return data as UpdateAdminUserStatusResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while updating user status");
    }
  }
);
