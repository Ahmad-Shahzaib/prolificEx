import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const DASHBOARD_OVERVIEW_CACHE_MS = 60_000;

export interface DashboardWalletEntry {
  id: number;
  coin: string;
  network: string;
  balance: string;
  locked_balance: string;
  available_balance: string;
  usd_value: number;
  price_usd: number;
  price_change_percentage_24h: number;
}

export interface DashboardMarketPrice {
  coin: string;
  coingecko_id: string;
  name: string;
  symbol: string;
  price_usd: number;
  price_change_percentage_24h: number;
  market_cap_usd: number | null;
  last_updated: string;
}

export interface DashboardOrdersData {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  recent: unknown[];
}

export interface DashboardKycData {
  kyc_level: number;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  is_pending: boolean;
}

export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: {
    wallet: {
      total_portfolio_usd: number;
      wallets: DashboardWalletEntry[];
      markets: Record<string, DashboardMarketPrice>;
    };
    orders: DashboardOrdersData;
    kyc: DashboardKycData;
  };
}

export const fetchDashboardOverview = createAsyncThunk<
  DashboardOverviewResponse,
  void,
  { rejectValue: string; state: RootState }
>(
  "dashboardOverview/fetchDashboardOverview",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch dashboard overview (${response.status})`);
      }

      return data as DashboardOverviewResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching dashboard overview");
    }
  },
  {
    condition: (_, { getState }) => {
      const { dashboardOverview } = getState();
      const hasCachedData = Boolean(dashboardOverview.data);
      const isFresh =
        dashboardOverview.loadedAt !== null &&
        Date.now() - dashboardOverview.loadedAt < DASHBOARD_OVERVIEW_CACHE_MS;

      return !dashboardOverview.loading && (!hasCachedData || !isFresh);
    },
  }
);
