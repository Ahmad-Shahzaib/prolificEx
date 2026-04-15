import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AdminP2PStatsData {
  total_orders: number;
  completed_orders: number;
  active_disputes: number;
  total_offers: number;
  active_offers: number;
}

export interface AdminP2PStatsResponse {
  success: boolean;
  message: string;
  data: AdminP2PStatsData;
}

export const fetchAdminP2PStats = createAsyncThunk<
  AdminP2PStatsResponse,
  void,
  { rejectValue: string }
>(
  "adminP2PStats/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const url = `${baseUrl}/admin/p2p/stats`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch admin P2P stats");
      }

      return data as AdminP2PStatsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching admin P2P stats");
    }
  }
);
