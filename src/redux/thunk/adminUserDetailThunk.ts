import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AdminUserDetail {
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
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  kyc_verifications: any[];
  two_factor_auth: any | null;
  login_sessions: any[];
}

export interface AdminUserDetailResponse {
  success: boolean;
  message: string;
  data: AdminUserDetail;
}

export const fetchAdminUserDetail = createAsyncThunk<
  AdminUserDetailResponse,
  number,
  { rejectValue: string }
>(
  "adminUserDetail/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/admin/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch user details");
      }

      return data as AdminUserDetailResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching user details");
    }
  }
);
