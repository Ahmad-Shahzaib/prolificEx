import { createAsyncThunk } from "@reduxjs/toolkit";

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordPayload,
  { rejectValue: string }
>(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Could not request password reset");
      }

      return data as ForgotPasswordResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);
