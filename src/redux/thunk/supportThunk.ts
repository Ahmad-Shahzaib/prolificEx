import { createAsyncThunk } from "@reduxjs/toolkit";

export interface SubmitTicketPayload {
  subject: string;
  message: string;
  category: string;
  priority: string;
}

export interface TicketData {
  id: number;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

export interface SubmitTicketResponse {
  success: boolean;
  message: string;
  data: TicketData;
}

export const submitSupportTicket = createAsyncThunk<
  SubmitTicketResponse,
  SubmitTicketPayload,
  { rejectValue: string }
>(
  "support/submitTicket",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/support/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to submit ticket (${res.status})`);
      }

      return data as SubmitTicketResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while submitting support ticket");
    }
  }
);
