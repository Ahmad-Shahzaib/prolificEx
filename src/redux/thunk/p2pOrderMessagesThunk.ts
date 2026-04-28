import { createAsyncThunk } from "@reduxjs/toolkit";
import { setOrderUnreadMessages } from "../slices/p2pOrdersSlice";

export interface P2POrderMessageSender {
  id: number;
  uuid: string;
  full_name: string;
  username: string | null;
  avatar: string | null;
}

export interface P2POrderMessageItem {
  id: number;
  order_id: number;
  sender_id: number;
  message: string;
  attachment: string | null;
  updated_at: string;
  created_at: string;
  sender: P2POrderMessageSender;
}

export const fetchP2POrderMessages = createAsyncThunk<
  P2POrderMessageItem[],
  number,
  { rejectValue: string }
>(
  "p2pOrderMessages/fetchP2POrderMessages",
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders/${orderId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch messages (${response.status})`);
      }

      const messages = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.data?.data)
        ? data.data.data
        : [];

      dispatch(setOrderUnreadMessages({ orderId, count: 0 }));
      return messages as P2POrderMessageItem[];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching messages");
    }
  }
);

export const sendP2POrderMessage = createAsyncThunk<
  P2POrderMessageItem,
  { order_id: number; message: string; attachment?: File | null },
  { rejectValue: string }
>(
  "p2pOrderMessages/sendP2POrderMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const formData = new FormData();
      formData.append("message", payload.message);
      if (payload.attachment) {
        formData.append("attachment", payload.attachment);
      }

      const response = await fetch(`${baseUrl}/p2p/orders/${payload.order_id}/messages`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to send message (${response.status})`);
      }

      return data.data as P2POrderMessageItem;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while sending message");
    }
  }
);
