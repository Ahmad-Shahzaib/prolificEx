import { createAsyncThunk } from "@reduxjs/toolkit";

export interface P2POrderUser {
  id: number;
  uuid: string;
  full_name: string;
  username: string | null;
}

export interface P2POrderOffer {
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
  completed_trades: number;
  rating: string;
  created_at: string;
  updated_at: string;
}

export interface P2POrderItem {
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
  payment_proof: string | null;
  escrow_txid: string | null;
  reason: string | null;
  paid_at: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  expired_at: string | null;
  last_payment_rejection_reason?: string | null;
  payment_attempts?: number;
  payment_rejected_at?: string | null;
  created_at: string;
  updated_at: string;
  unread_messages?: number;
  offer: P2POrderOffer;
  buyer: P2POrderUser;
  seller: P2POrderUser;
  payment_details?: {
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    iban_number?: string;
    instructions?: string;
    source?: string;
  } | null;
}

export interface P2POrderLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface P2POrdersData {
  current_page: number;
  data: P2POrderItem[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: P2POrderLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface P2POrdersResponse {
  success: boolean;
  message: string;
  data: P2POrdersData;
}

export interface P2POrdersRequest {
  page?: number;
  per_page?: number;
  status?: string;
}

export interface ConfirmP2POrderResponse {
  success: boolean;
  message: string;
  data: P2POrderItem;
}

export interface ReleaseP2POrderPayload {
  order_id: number;
}

export interface CancelP2POrderPayload {
  order_id: number;
  reason?: string;
}

export interface CancelP2POrderResponse {
  success: boolean;
  message: string;
  data: Partial<P2POrderItem> & {
    status: string;
    payment_attempts?: number;
    last_payment_rejection_reason?: string | null;
    payment_rejected_at?: string | null;
  };
}

export interface PaymentNotReceivedPayload {
  order_id: number;
  reason: string;
}

export interface PaymentNotReceivedResponse {
  success: boolean;
  message: string;
  data: Partial<P2POrderItem> & {
    id?: number;
    status?: string;
    payment_attempts?: number;
    last_payment_rejection_reason?: string | null;
    payment_rejected_at?: string | null;
  };
}

export const fetchMyOrders = createAsyncThunk<
  P2POrdersResponse,
  P2POrdersRequest,
  { rejectValue: string }
>(
  "p2pOrders/fetchMyOrders",
  async ({ page = 1, per_page = 20, status }, { rejectWithValue }) => {
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

      if (status && status !== "all") {
        query.append("status", status);
      }

      const response = await fetch(`${baseUrl}/p2p/orders?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch orders (${response.status})`);
      }

      return data as P2POrdersResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching orders");
    }
  }
);

export const fetchP2POrder = createAsyncThunk<
  P2POrderItem,
  number,
  { rejectValue: string }
>(
  "p2pOrders/fetchP2POrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch order (${response.status})`);
      }

      return data.data as P2POrderItem;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching order");
    }
  }
);

export const releaseOrderCrypto = createAsyncThunk<
  ConfirmP2POrderResponse,
  ReleaseP2POrderPayload,
  { rejectValue: string }
>(
  "p2pOrders/releaseOrderCrypto",
  async ({ order_id }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders/${order_id}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to release crypto (${response.status})`);
      }

      return data as ConfirmP2POrderResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while releasing crypto");
    }
  }
);

export const cancelP2POrder = createAsyncThunk<
  CancelP2POrderResponse,
  CancelP2POrderPayload,
  { rejectValue: string }
>(
  "p2pOrders/cancelP2POrder",
  async ({ order_id, reason }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders/${order_id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(reason ? { reason } : {}),
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        return rejectWithValue(
          response.ok
            ? `Unexpected response while cancelling payment`
            : text || `Failed to cancel payment (${response.status})`
        );
      }

      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to cancel payment (${response.status})`);
      }

      return data as CancelP2POrderResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while cancelling payment");
    }
  }
);

export const reportPaymentNotReceived = createAsyncThunk<
  PaymentNotReceivedResponse,
  PaymentNotReceivedPayload,
  { rejectValue: string }
>(
  "p2pOrders/reportPaymentNotReceived",
  async ({ order_id, reason }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders/${order_id}/payment-not-received`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        return rejectWithValue(
          response.ok
            ? "Unexpected response while reporting payment not received"
            : text || `Failed to report payment not received (${response.status})`
        );
      }

      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to report payment not received (${response.status})`);
      }

      return data as PaymentNotReceivedResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while reporting payment not received");
    }
  }
);

export const confirmOrderPayment = releaseOrderCrypto;
export const cancelOrderPayment = cancelP2POrder;
