import { createAsyncThunk } from '@reduxjs/toolkit';

export interface WithdrawPayload {
  coin: string;
  network: string;
  address: string;
  amount: string;
  two_fa_code: string;
}

export interface WithdrawResponse {
  success: boolean;
  message: string;
  data: {
    transaction_id: number;
    tx_hash?: string;
    amount: string;
    fee: string;
    coin: string;
    network: string;
    address: string;
    status: string;
  };
}

export const withdrawThunk = createAsyncThunk<
  WithdrawResponse,
  WithdrawPayload,
  { rejectValue: string }
>(
  'withdraw/withdrawThunk',
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const url = baseUrl ? `${baseUrl}/wallet/withdraw` : '/wallet/withdraw';
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to submit withdrawal (${response.status})`);
      }

      return data as WithdrawResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Network error while submitting withdrawal');
    }
  }
);
