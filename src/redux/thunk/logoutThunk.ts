import { createAsyncThunk } from "@reduxjs/toolkit";

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export const logoutUser = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: string }
>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const tokenType = typeof window !== "undefined" ? localStorage.getItem("authTokenType") : null;
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

      const res = await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `${tokenType ?? "Bearer"} ${token}` }),
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Logout failed");
      }

      return data as LogoutResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);
