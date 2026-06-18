import { createAsyncThunk } from "@reduxjs/toolkit";

export interface BuyerSeller {
  id: number;
  uuid: string;
  full_name: string;
  email: string;
}

export interface Dispute {
  id: number;
  order_number: string;
  offer_id: number;
  buyer_id: number;
  seller_id: number;
  coin: string;
  network: string;
  crypto_amount: string;
  fiat_amount: string;
  price_per_coin: string;
  fee: string;
  fiat_currency: string;
  payment_method: string;
  status: string;
  payment_proof: string;
  payment_attempts: number;
  last_payment_rejection_reason: string | null;
  payment_rejected_at: string | null;
  escrow_txid: string | null;
  dispute_reason: string;
  paid_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  expired_at: string | null;
  created_at: string;
  updated_at: string;
  buyer: BuyerSeller;
  seller: BuyerSeller;
}

export interface DisputesData {
  current_page: number;
  data: Dispute[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; page: number | null; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface DisputesResponse {
  success: boolean;
  message: string;
  data: DisputesData;
}

export interface FetchAdminDisputesParams {
  per_page?: number;
  page?: number;
}

export const fetchAdminDisputes = createAsyncThunk<
  DisputesResponse,
  FetchAdminDisputesParams | undefined,
  { rejectValue: string }
>(
  "adminDisputes/fetchDisputes",
  async (params, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const query = new URLSearchParams();
      const perPage = typeof params?.per_page !== "undefined" ? params.per_page : 20;
      query.append("per_page", String(perPage));
      const page = typeof params?.page !== "undefined" ? params.page : 1;
      query.append("page", String(page));

      const url = `${baseUrl}/admin/p2p/disputes${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch disputes");
      }

      return data as DisputesResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching disputes");
    }
  }
);

export interface ResolveDisputeParams {
  disputeId: string | number;
  target: "buyer" | "seller";
  notes: string;
}

export interface ResolveDisputeResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const resolveDispute = createAsyncThunk<
  ResolveDisputeResponse,
  ResolveDisputeParams,
  { rejectValue: string }
>(
  "adminDisputes/resolveDispute",
  async ({ disputeId, target, notes }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const url = `${baseUrl}/admin/p2p/disputes/${disputeId}/resolve/${target}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to resolve dispute");
      }

      return data as ResolveDisputeResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while resolving dispute");
    }
  }
);
