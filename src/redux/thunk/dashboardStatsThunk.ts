import { createAsyncThunk } from "@reduxjs/toolkit";

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    total_users: number;
    active_users: number;
    suspended_users: number;
    banned_users: number;
    kyc_level_0: number;
    kyc_level_2: number;
    pending_kyc: number;
    active_sessions: number;
    users_today: number;
  };
}

export const fetchDashboardStats = createAsyncThunk<
  DashboardStatsResponse,
  void,
  { rejectValue: string }
>(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const res = await fetch(`${baseUrl}/admin/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch dashboard stats");
      }

      return data as DashboardStatsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching dashboard stats");
    }
  }
);
