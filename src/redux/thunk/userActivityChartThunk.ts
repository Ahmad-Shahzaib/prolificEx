import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const USER_ACTIVITY_CHART_CACHE_MS = 60_000;

export type UserActivityChartRange = "1h" | "3h" | "1d" | "1w" | "1m";

export interface UserActivityChartSummary {
  transactions: number;
  p2p_orders: number;
  completed_transactions: number;
  completed_orders: number;
}

export interface UserActivityChartPoint {
  timestamp: string;
  label: string;
  [key: string]: string | number | null | undefined;
}

export interface UserActivityChartBar {
  timestamp: string;
  label: string;
  value: number;
  [key: string]: string | number | null | undefined;
}

export interface UserActivityChartSeries {
  line_key: string;
  bar_key: string;
  points: UserActivityChartPoint[];
  bars: UserActivityChartBar[];
}

export interface UserActivityChartData {
  title: string;
  subtitle: string;
  range: UserActivityChartRange;
  value: number;
  summary: UserActivityChartSummary;
  series: UserActivityChartSeries;
  recent_transactions: unknown[];
  recent_orders: unknown[];
}

export interface UserActivityChartResponse {
  success: boolean;
  message: string;
  data: UserActivityChartData;
}

export interface FetchUserActivityChartParams {
  range: UserActivityChartRange;
}

export const fetchUserActivityChart = createAsyncThunk<
  UserActivityChartResponse,
  FetchUserActivityChartParams,
  { rejectValue: string; state: RootState }
>(
  "userActivityChart/fetch",
  async ({ range }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const url = `${baseUrl}/dashboard/user-activity-chart?range=${encodeURIComponent(range)}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch user activity chart data");
      }

      return data as UserActivityChartResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching user activity chart data");
    }
  },
  {
    condition: ({ range }, { getState }) => {
      const { userActivityChart } = getState();
      const isSameRange = userActivityChart.currentRange === range;
      const hasCachedData = Boolean(userActivityChart.data);
      const isFresh =
        userActivityChart.loadedAt !== null &&
        Date.now() - userActivityChart.loadedAt < USER_ACTIVITY_CHART_CACHE_MS;

      return !userActivityChart.loading && (!isSameRange || !hasCachedData || !isFresh);
    },
  }
);
