import { createAsyncThunk } from "@reduxjs/toolkit";

export interface WalletEntry {
  id: number;
  coin: string;
  network: string;
  balance: string;
  locked_balance: string;
  available_balance: string;
  usd_value: number;
}

export interface WalletsResponse {
  success: boolean;
  message: string;
  data: {
    total_portfolio_usd: number;
    wallets: Record<string, WalletEntry[]>;
  };
}

export const fetchWallets = createAsyncThunk<
  WalletsResponse,
  void,
  { rejectValue: string }
>(
  "wallet/fetchWallets",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const res = await fetch(`${baseUrl}/wallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch wallets (${res.status})`);
      }

      return data as WalletsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching wallets");
    }
  }
);
