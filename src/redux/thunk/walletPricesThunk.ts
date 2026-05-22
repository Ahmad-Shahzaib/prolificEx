import { createAsyncThunk } from "@reduxjs/toolkit";

export interface WalletPriceItem {
  coin: string;
  coingecko_id: string;
  name: string;
  symbol: string;
  price_usd: number;
  price_change_percentage_24h: number;
  market_cap_usd: number | null;
  last_updated: string;
}

interface RawWalletPriceValue {
  coin: string;
  coingecko_id: string;
  name: string;
  symbol: string;
  price_usd: number | string;
  price_change_percentage_24h: number | string;
  market_cap_usd: number | null;
  last_updated: string;
}

export interface WalletPricesResponse {
  success: boolean;
  message: string;
  data: {
    prices: Record<string, RawWalletPriceValue | number>;
    updated_at?: string | null;
  };
}

export const fetchWalletPrices = createAsyncThunk<
  WalletPricesResponse,
  void,
  { rejectValue: string }
>(
  "walletPrices/fetchWalletPrices",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/wallet/prices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch wallet prices (${response.status})`);
      }

      const parseNumericValue = (value: any) => {
        if (value === null || value === undefined) return NaN;
        const normalized = String(value).replace(/[,\s]/g, "").replace(/[^0-9.\-]/g, "");
        const parsed = parseFloat(normalized);
        return Number.isFinite(parsed) ? parsed : NaN;
      };

      const normalizedPrices = Object.entries(data.data.prices || {}).reduce(
        (acc, [key, item]: [string, RawWalletPriceValue | number]) => {
          if (typeof item === "number") {
            acc[key] = {
              coin: key,
              coingecko_id: key.toLowerCase(),
              name: key,
              symbol: key,
              price_usd: item,
              price_change_percentage_24h: 0,
              market_cap_usd: null,
              last_updated: data.data.updated_at || "",
            };
          } else {
            acc[key] = {
              coin: item.coin || key,
              coingecko_id: item.coingecko_id || key.toLowerCase(),
              name: item.name || key,
              symbol: item.symbol || key,
              price_usd: parseNumericValue(item.price_usd),
              price_change_percentage_24h: parseNumericValue(item.price_change_percentage_24h),
              market_cap_usd:
                item.market_cap_usd === null || item.market_cap_usd === undefined
                  ? null
                  : parseNumericValue(item.market_cap_usd) || null,
              last_updated: item.last_updated || data.data.updated_at || "",
            };
          }
          return acc;
        },
        {} as Record<string, WalletPriceItem>
      );

      return {
        ...data,
        data: {
          ...data.data,
          prices: normalizedPrices,
        },
      } as WalletPricesResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching wallet prices");
    }
  }
);
