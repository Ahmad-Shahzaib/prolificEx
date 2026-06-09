import { createAsyncThunk } from "@reduxjs/toolkit";

export interface VerifyForgotPasswordOtpPayload {
  email: string;
  code: string;
}

export interface VerifyForgotPasswordOtpResponse {
  success: boolean;
  message: string;
}

export const verifyForgotPasswordOtp = createAsyncThunk<
  VerifyForgotPasswordOtpResponse,
  VerifyForgotPasswordOtpPayload,
  { rejectValue: string }
>(
  "auth/verifyForgotPasswordOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const endpoints = [
        `${baseUrl}/auth/forgot-password/verify`,
        `${baseUrl}/auth/verify-reset-password`,
        `${baseUrl}/auth/verify-password-reset`,
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (res.status === 404) {
            continue;
          }

          const data = await res.json().catch(() => null);
          if (!res.ok || !data?.success) {
            return rejectWithValue(data?.message || "OTP verification failed");
          }

          return data as VerifyForgotPasswordOtpResponse;
        } catch (error: any) {
          if (error?.message?.includes("Failed to fetch")) {
            continue;
          }
          return rejectWithValue(error?.message || "OTP verification failed");
        }
      }

      return rejectWithValue("Could not verify OTP at this time.");
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);
