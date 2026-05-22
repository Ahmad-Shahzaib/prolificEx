import { createAsyncThunk } from "@reduxjs/toolkit";

export type NotificationStatus = "unread" | "read" | "all";

export interface NotificationData {
  device?: string;
  ip_address?: string;
  location?: string;
  is_new?: boolean;
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface FetchNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    unread_count: number;
    filters: { status: NotificationStatus };
    pagination: NotificationsPagination;
  };
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message: string;
}

const getAuthToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

export const fetchNotifications = createAsyncThunk<
  FetchNotificationsResponse,
  NotificationStatus,
  { rejectValue: string }
>("notifications/fetch", async (status = "all", { rejectWithValue }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!baseUrl) return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");

    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/notifications?status=${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      return rejectWithValue(data?.message || `Failed to fetch notifications (${res.status})`);
    }

    return data as FetchNotificationsResponse;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Network error while fetching notifications");
  }
});

export const markNotificationRead = createAsyncThunk<
  MarkNotificationReadResponse,
  number,
  { rejectValue: string }
>("notifications/markRead", async (notificationId, { rejectWithValue }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!baseUrl) return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");

    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      return rejectWithValue(data?.message || `Failed to mark notification as read (${res.status})`);
    }

    return data as MarkNotificationReadResponse;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Network error while marking notification as read");
  }
});

export const markAllNotificationsRead = createAsyncThunk<
  MarkNotificationReadResponse,
  void,
  { rejectValue: string }
>("notifications/markAllRead", async (_, { rejectWithValue }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!baseUrl) return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");

    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/notifications/read-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      return rejectWithValue(data?.message || `Failed to mark all as read (${res.status})`);
    }

    return data as MarkNotificationReadResponse;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Network error while marking all notifications as read");
  }
});
