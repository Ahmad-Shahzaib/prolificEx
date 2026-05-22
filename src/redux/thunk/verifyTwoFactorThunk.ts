import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserPayload } from "./loginThunk";

export interface VerifyTwoFactorPayload {
  pending_token: string;
  code: string;
}

export interface VerifyTwoFactorResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
    user: UserPayload;
  };
}

const parseJsonSafe = async (res: Response) => {
  const text = await res.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error(`Invalid JSON response from ${res.url} (status ${res.status}): ${text.slice(0, 200)}`);
  }
};

export const verifyTwoFactorLogin = createAsyncThunk<
  VerifyTwoFactorResponse,
  VerifyTwoFactorPayload,
  { rejectValue: string }
>(
  "auth/verifyTwoFactorLogin",
  async ({ pending_token, code }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${baseUrl}/auth/2fa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pending_token, code }),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || "Failed to verify two-factor authentication");
      }

      return data as VerifyTwoFactorResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);
