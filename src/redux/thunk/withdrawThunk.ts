import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface WithdrawPayload {
  coin: string;
  network: string;
  address: string;
  amount: string;
  two_fa_code?: string;
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

const getValidToken = (value: unknown) => {
  if (typeof value !== 'string') return '';

  const token = value.trim();
  if (!token || token === 'null' || token === 'undefined') {
    return '';
  }

  return token;
};

export const withdrawThunk = createAsyncThunk<
  WithdrawResponse,
  WithdrawPayload,
  { state: RootState; rejectValue: string }
>(
  'withdraw/withdrawThunk',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const url = baseUrl ? `${baseUrl}/wallet/withdraw` : '/wallet/withdraw';
      const authState = getState().auth;
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const storedTokenType = typeof window !== 'undefined' ? localStorage.getItem('authTokenType') : null;
      const token = getValidToken(authState.token) || getValidToken(storedToken);
      const tokenType = getValidToken(authState.token_type) || getValidToken(storedTokenType) || 'Bearer';

      if (!token) {
        return rejectWithValue('Your login session has expired. Please log in again before withdrawing.');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${tokenType} ${token}`,
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
