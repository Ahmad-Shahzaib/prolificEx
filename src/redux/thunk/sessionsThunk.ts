import { createAsyncThunk } from "@reduxjs/toolkit";

export interface SessionItem {
  id: number;
  device: string;
  ip_address: string;
  location: string;
  last_active_at: string;
  created_at: string;
  is_current: boolean;
}

export interface SessionsResponse {
  success: boolean;
  message: string;
  data: SessionItem[];
}

export interface RevokeSessionResponse {
  success: boolean;
  message: string;
  data: {
    revoked: boolean;
  };
}

export interface RevokeSessionPayload {
  id: number;
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

export const fetchSessions = createAsyncThunk<
  SessionsResponse,
  void,
  { rejectValue: string }
>(
  "sessions/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch sessions (${res.status})`);
      }

      return data as SessionsResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching sessions");
    }
  }
);

export const revokeSession = createAsyncThunk<
  RevokeSessionResponse,
  RevokeSessionPayload,
  { rejectValue: string }
>(
  "sessions/revokeSession",
  async ({ id }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/sessions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to revoke session (${res.status})`);
      }

      return data as RevokeSessionResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while revoking session");
    }
  }
);
