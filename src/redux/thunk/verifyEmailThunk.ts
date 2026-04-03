import { createAsyncThunk } from '@reduxjs/toolkit';

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  VerifyEmailPayload,
  { rejectValue: string }
>(
  'auth/verifyEmail',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || 'Email verification failed');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Network error');
    }
  }
);
