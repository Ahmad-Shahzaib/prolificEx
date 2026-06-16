import { createAsyncThunk } from "@reduxjs/toolkit";

export interface CreateP2POrderPayload {
  offer_id: number;
  crypto_amount: string;
}

export interface P2POrderSeller {
  id: number;
  uuid: string;
  full_name: string;
  username: string | null;
}

export interface P2POrderPaymentInfo {
  bank_name: string;
  account_name: string;
  account_number: string;
  instructions: string;
  fiat_amount: string;
  fiat_currency: string;
  payment_method: string;
  expires_at: string;
}

export interface P2POrderItem {
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
  paid_at: string | null;
  expired_at: string;
  order_number: string;
  updated_at: string;
  created_at: string;
  id: number;
  offer: Record<string, any>;
  seller: P2POrderSeller;
}

export interface P2POrderResponseData {
  order: P2POrderItem;
  payment_info: P2POrderPaymentInfo;
}

export const initiateP2POrder = createAsyncThunk<
  P2POrderResponseData,
  CreateP2POrderPayload,
  { rejectValue: string }
>(
  "p2pOrder/initiateP2POrder",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to create order (${response.status})`);
      }

      return data.data as P2POrderResponseData;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while creating order");
    }
  }
);

export interface P2PPaymentProofPayload {
  order_id: number;
  payment_proof: File;
}

export interface P2PPaymentProofResponseData {
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
  created_at: string;
  updated_at: string;
}

export const submitP2PPaymentProof = createAsyncThunk<
  P2PPaymentProofResponseData,
  P2PPaymentProofPayload,
  { rejectValue: string }
>(
  "p2pOrder/submitP2PPaymentProof",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const formData = new FormData();
      formData.append("payment_proof", payload.payment_proof);

      const response = await fetch(`${baseUrl}/p2p/orders/${payload.order_id}/paid`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to submit payment proof (${response.status})`);
      }

      return data.data as P2PPaymentProofResponseData;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while submitting payment proof");
    }
  }
);

export interface P2PDisputePayload {
  order_id: number;
  reason: string;
}

export interface P2PDisputeResponseData {
  id: number;
  status: string;
  reason: string | null;
  [key: string]: any;
}

export const disputeP2POrder = createAsyncThunk<
  P2PDisputeResponseData,
  P2PDisputePayload,
  { rejectValue: string }
>(
  "p2pOrder/disputeP2POrder",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders/${payload.order_id}/dispute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason: payload.reason }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to submit dispute (${response.status})`);
      }

      return data.data as P2PDisputeResponseData;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while submitting dispute");
    }
  }
);
