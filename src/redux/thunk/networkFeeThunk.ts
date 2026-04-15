import { createAsyncThunk } from "@reduxjs/toolkit";

export interface NetworkFeeRequest {
  coin: string;
  network: string;
  amount: number;
}

export interface NetworkFeeData {
  coin: string;
  network: string;
  network_fee: string;
  you_receive: number;
}

export interface NetworkFeeResponse {
  success: boolean;
  message: string;
  data: NetworkFeeData;
}

export const fetchNetworkFee = createAsyncThunk<
  NetworkFeeResponse,
  NetworkFeeRequest,
  { rejectValue: string }
>(
  "networkFee/fetchNetworkFee",
  async ({ coin, network, amount }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const query = new URLSearchParams({
        coin,
        network,
        amount: amount.toString(),
      });

      const res = await fetch(`${baseUrl}/wallet/fee?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch network fee (${res.status})`);
      }

      return data as NetworkFeeResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching fee information");
    }
  }
);
