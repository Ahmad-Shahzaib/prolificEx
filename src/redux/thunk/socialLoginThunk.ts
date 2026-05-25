import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginResponse } from "./loginThunk";

export interface SocialLoginPayload {
  provider: "google" | "apple";
  id_token: string;
  full_name?: string;
}

export const socialLogin = createAsyncThunk<
  LoginResponse,
  SocialLoginPayload,
  { rejectValue: string }
>(
  "auth/socialLogin",
  async ({ provider, ...payload }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");

      const res = await fetch(`${baseUrl}/auth/${provider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || `${provider} login failed`);
      }

      return data as LoginResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);
