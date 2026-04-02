import { createAsyncThunk } from "@reduxjs/toolkit";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface UserPayload {
  uuid: string;
  full_name: string;
  email: string;
  phone: string;
  kyc_level: number;
  status: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
    user: UserPayload;
  };
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Login failed");
      }

      return data as LoginResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);
