import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  Notification,
  NotificationStatus,
  NotificationsPagination,
} from "../thunk/notificationsThunk";

interface NotificationsState {
  notifications: Notification[];
  unread_count: number;
  activeFilter: NotificationStatus;
  pagination: NotificationsPagination | null;
  loading: boolean;
  error: string | null;
  markingReadId: number | null;
  markingAllRead: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  unread_count: 0,
  activeFilter: "all",
  pagination: null,
  loading: false,
  error: null,
  markingReadId: null,
  markingAllRead: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<NotificationStatus>) {
      state.activeFilter = action.payload;
    },
    clearNotificationsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const { notifications, unread_count, filters, pagination } = action.payload.data;
        state.notifications = notifications;
        state.unread_count = unread_count;
        state.activeFilter = filters.status;
        state.pagination = pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load notifications";
      })

      // markNotificationRead
      .addCase(markNotificationRead.pending, (state, action) => {
        state.markingReadId = action.meta.arg;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.meta.arg;
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.read_at) {
          notification.read_at = new Date().toISOString();
          state.unread_count = Math.max(0, state.unread_count - 1);
        }
        state.markingReadId = null;
      })
      .addCase(markNotificationRead.rejected, (state) => {
        state.markingReadId = null;
      })

      // markAllNotificationsRead
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.markingAllRead = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        const now = new Date().toISOString();
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read_at: n.read_at ?? now,
        }));
        state.unread_count = 0;
        state.markingAllRead = false;
      })
      .addCase(markAllNotificationsRead.rejected, (state) => {
        state.markingAllRead = false;
      });
  },
});

export const { setActiveFilter, clearNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
