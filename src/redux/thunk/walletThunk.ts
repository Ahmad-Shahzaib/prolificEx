import { createAsyncThunk } from "@reduxjs/toolkit";

export interface PriceData {
  coin: string;
  coingecko_id: string;
  name: string;
  symbol: string;
  price_usd: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  last_updated: string;
}

export interface CoinBalance {
  coin: string;
  total_balance: string;
  locked_balance: string;
  available_balance: string;
  remaining_available_balance: string;
  usd_value: number;
  available_usd_value: number;
  price_per_coin: number;
  price_change_percentage_24h: number;
}

export interface WalletEntry {
  id: number;
  coin: string;
  network: string;
  balance: string;
  locked_balance: string;
  available_balance: string;
  remaining_available_balance: string;
  usd_value: number;
  available_usd_value: number;
  price_per_coin: number;
  price_change_percentage_24h: number;
}

export interface WalletsResponse {
  success: boolean;
  message: string;
  data: {
    total_portfolio_usd: number;
    prices: Record<string, PriceData>;
    coin_balances: Record<string, CoinBalance>;
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

export interface WalletConvertPayload {
  from_coin: string;
  to_coin: string;
  amount: string;
}

export interface WalletConvertResponse {
  success: boolean;
  message: string;
  data: Record<string, any>;
}

export const convertWallet = createAsyncThunk<
  WalletConvertResponse,
  WalletConvertPayload,
  { rejectValue: string }
>(
  "wallet/convertWallet",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const res = await fetch(`${baseUrl}/wallet/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to convert wallet (${res.status})`);
      }

      return data as WalletConvertResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while converting wallet balance");
    }
  }
);
