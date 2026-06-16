import { createAsyncThunk } from "@reduxjs/toolkit";

export interface P2POffer {
  id: number;
  user_id: number;
  type: "buy" | "sell";
  coin: string;
  network: string;
  amount: string;
  available_amount: string;
  min_order_limit: string;
  max_order_limit: string;
  price_per_coin: string;
  price_type: string;
  fiat_currency: string;
  payment_method: string;
  payment_window: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  instructions: string;
  status: string;
  rating: string;
  rating_count?: number;
  trader_rating?: string;
  trader_rating_count?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    uuid: string;
    full_name: string;
    username: string | null;
    rating: string;
    rating_count: number;
  };
}

export interface CreateP2POfferPayload {
  type: "sell" | "buy";
  coin: string;
  network: string;
  amount: string;
  min_order_limit: string;
  max_order_limit: string;
  price_per_coin: string;
  price_type: string;
  fiat_currency: string;
  payment_method: string;
  payment_window: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  instructions: string;
}

export const createOffer = createAsyncThunk<
  P2POffer,
  CreateP2POfferPayload,
  { rejectValue: string }
>(
  "p2pOffers/createOffer",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to create offer (${response.status})`);
      }

      return data.data as P2POffer;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while creating offer");
    }
  }
);

export const fetchOffers = createAsyncThunk<
  P2POffer[],
  { page?: number; per_page?: number; coin?: string; network?: string; payment_method?: string },
  { rejectValue: string }
>(
  "p2pOffers/fetchOffers",
  async ({ page = 1, per_page = 20, coin, network, payment_method }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const query = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
      });

      if (coin) {
        query.append("coin", coin);
      }
      if (network) {
        query.append("network", network);
      }
      if (payment_method) {
        query.append("payment_method", payment_method);
      }

      const response = await fetch(`${baseUrl}/p2p/offers?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load offers (${response.status})`);
      }

      if (Array.isArray(data?.data)) {
        return data.data as P2POffer[];
      }

      if (Array.isArray(data?.data?.data)) {
        return data.data.data as P2POffer[];
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching offers");
    }
  }
);

export const fetchMyOffers = createAsyncThunk<
  P2POffer[],
  void,
  { rejectValue: string }
>(
  "p2pOffers/fetchMyOffers",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/offers/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load your offers (${response.status})`);
      }

      // API response may return a paginated wrapper under data.data
      // Example: { success: true, data: { current_page: 1, data: [...] } }
      if (Array.isArray(data?.data)) {
        return data.data as P2POffer[];
      }

      if (Array.isArray(data?.data?.data)) {
        return data.data.data as P2POffer[];
      }

      if (Array.isArray(data?.data?.offers)) {
        return data.data.offers as P2POffer[];
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching offers");
    }
  }
);
