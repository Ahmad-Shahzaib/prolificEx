import { createAsyncThunk } from "@reduxjs/toolkit";

export interface TransactionItem {
  id: number;
  user_id: number;
  wallet_id: number;
  type: string;
  coin: string;
  network: string;
  amount: string;
  fee: string;
  status: string;
  txid: string | null;
  from_address: string | null;
  to_address: string | null;
  nowpayments_id: string | null;
  confirmations: number;
  meta: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface TransactionsData {
  current_page: number;
  data: TransactionItem[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: TransactionLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: TransactionsData;
}

export interface TransactionsRequest {
  page?: number;
  per_page?: number;
  type?: string;
  coin?: string;
}

export const fetchTransactions = createAsyncThunk<
  TransactionsResponse,
  TransactionsRequest,
  { rejectValue: string }
>(
  "transactions/fetchTransactions",
  async ({ page = 1, per_page = 20, type, coin }, { rejectWithValue }) => {
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

      if (type) {
        query.append("type", type);
      }
      if (coin) {
        query.append("coin", coin);
      }

      const res = await fetch(`${baseUrl}/wallet/transactions?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch transactions (${res.status})`);
      }

      return data as TransactionsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching transactions");
    }
  }
);
