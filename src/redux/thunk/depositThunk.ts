import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const DEPOSIT_INFO_CACHE_MS = 60_000;

export interface DepositRecent {
  coin: string;
  fee: string;
  amount: string;
  date: string;
  type: string;
  status: "Complete" | "Canceled" | "Finished" | "Pending" | string;
  tx_hash?: string;
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

export interface DepositInfoRequest {
  coin: string;
  network: string;
  force?: boolean;
}

export const getDepositInfoRequestKey = ({ coin, network }: DepositInfoRequest) =>
  `${coin.toUpperCase()}:${network.toUpperCase()}`;

export const fetchDepositInfo = createAsyncThunk<
  DepositInfoResponse,
  DepositInfoRequest,
  { rejectValue: string; state: RootState }
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
  },
  {
    condition: (request, { getState }) => {
      if (request.force) return true;

      const { deposit } = getState();
      const requestKey = getDepositInfoRequestKey(request);
      const isSameRequest = deposit.lastRequestKey === requestKey;
      const isFresh =
        deposit.loadedAt !== null &&
        Date.now() - deposit.loadedAt < DEPOSIT_INFO_CACHE_MS;

      return !deposit.loading && (!isSameRequest || !isFresh);
    },
  }
);