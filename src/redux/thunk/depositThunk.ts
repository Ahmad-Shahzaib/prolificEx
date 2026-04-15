import { createAsyncThunk } from "@reduxjs/toolkit";

export interface DepositRecent {
  coin: string;
  fee: string;
  amount: string;
  date: string;
  type: string;
  status: "Complete" | "Canceled" | "Finished" | "Pending" | string;
}

export interface DepositInfoData {
  coin: string;
  network: string;
  address: string;
  qr_data: string;
  min_deposit: number;
  confirmations: number;
  warning: string;
  recent_deposits: DepositRecent[];
}

export interface DepositInfoResponse {
  success: boolean;
  message: string;
  data: DepositInfoData;
}

export const fetchDepositInfo = createAsyncThunk<
  DepositInfoResponse,
  { coin: string; network: string },
  { rejectValue: string }
>(
  "deposit/fetchDepositInfo",
  async ({ coin, network }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const res = await fetch(
        `${baseUrl}/wallet/${encodeURIComponent(coin)}/deposit?network=${encodeURIComponent(network)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await res.json();
      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch deposit info (${res.status})`);
      }

      return data as DepositInfoResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching deposit info");
    }
  }
);
