import { createAsyncThunk } from "@reduxjs/toolkit";

export interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordPayload,
  { rejectValue: string }
>(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Password reset failed");
      }

      return data as ResetPasswordResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);
