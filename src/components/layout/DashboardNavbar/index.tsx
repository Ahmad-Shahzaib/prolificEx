"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/providers/SidebarContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserProfile, deactivateUserAccount } from "@/redux/thunk/profileThunk";
import { logout } from "@/redux/slices/authSlice";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, Notification } from "@/redux/thunk/notificationsThunk";
import { setActiveFilter } from "@/redux/slices/notificationsSlice";
import type { NotificationStatus } from "@/redux/thunk/notificationsThunk";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/p2p": "P2P Marketplace",
  "/dashboard/wallet": "Wallet",
  "/dashboard/deposit": "Deposit",
  "/dashboard/withdraw": "Withdraw",
  "/dashboard/history": "Transaction History",
  "/dashboard/kyc": "KYC Verification",
  "/dashboard/security": "Security",
  "/dashboard/support": "Support",
  "/dashboard/settings": "Settings",
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");
};

export function DashboardNavbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";
  const { toggle } = useSidebar();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const deactivateLoading = useAppSelector((state) => state.profile.deactivateLoading);
  const deactivateError = useAppSelector((state) => state.profile.deactivateError);
  const deactivateMessage = useAppSelector((state) => state.profile.deactivateMessage);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [expandedNotificationId, setExpandedNotificationId] = useState<number | null>(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);

  const { notifications, unread_count, loading: notifLoading, activeFilter, markingAllRead } = useAppSelector(
    (state) => state.notifications
  );

  const router = useRouter();

  const displayName = profile?.full_name || profile?.username || "";
  const initials = profile?.full_name
    ? getInitials(profile.full_name)
    : profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "CH";

  const avatarUrl = profile?.avatar && !avatarLoadError ? profile.avatar : null;

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications("all"));
  }, [dispatch]);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
        setExpandedNotificationId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationBellClick = () => {
    setIsNotificationsOpen((prev) => {
      if (!prev) dispatch(fetchNotifications(activeFilter));
      return !prev;
    });
    setIsProfileMenuOpen(false);
    setExpandedNotificationId(null);
  };

  const handleFilterChange = (filter: NotificationStatus) => {
    dispatch(setActiveFilter(filter));
    dispatch(fetchNotifications(filter));
  };

  const handleNotificationClick = (notification: Notification) => {
    setExpandedNotificationId((prev) => (prev === notification.id ? null : notification.id));
    if (!notification.read_at) {
      dispatch(markNotificationRead(notification.id));
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const closeDeactivateModal = () => {
    setIsDeactivateModalOpen(false);
    setPassword("");
    setLocalError(null);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    router.push("/dashboard/settings");
  };

  const handleDeactivateSubmit = async () => {
    if (!password.trim()) {
      setLocalError("Please enter your current password.");
      return;
    }

    try {
      await dispatch(deactivateUserAccount({ password: password.trim() })).unwrap();
      dispatch(logout());
      router.push("/");
    } catch (error: any) {
      setLocalError(typeof error === "string" ? error : "Failed to deactivate account.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 lg:left-[200px] right-0 z-30 h-[64px] bg-[#0d0e14] border-b border-white/5 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          data-testid="button-sidebar-toggle"
          aria-label="Toggle sidebar menu"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1b23] text-[#6b7280] hover:text-white transition-colors cursor-pointer border-none"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="[font-family:'Inter',Helvetica] font-bold text-white text-base sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            data-testid="input-search"
            className="w-[160px] md:w-[200px] lg:w-[280px] h-9 bg-[#1a1b23] border border-white/10 rounded-xl px-4 pr-10 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-violet-500/50 [font-family:'Inter',Helvetica] transition-colors"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div ref={notificationsRef} className="relative">
          <button
            data-testid="button-notifications"
            aria-label="Notifications"
            onClick={handleNotificationBellClick}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1b23] text-[#6b7280] hover:text-white transition-colors cursor-pointer border-none"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 6C14 3.24 11.76 1 9 1C6.24 1 4 3.24 4 6C4 11 1 12.5 1 12.5H17C17 12.5 14 11 14 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.73 15.5C10.39 16.06 9.74 16.5 9 16.5C8.26 16.5 7.61 16.06 7.27 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {unread_count > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-[#12131a] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white [font-family:'Inter',Helvetica]">Notifications</span>
                  {unread_count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-400 text-[10px] font-semibold">
                      {unread_count}
                    </span>
                  )}
                </div>
                {unread_count > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markingAllRead}
                    className="text-[11px] text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors [font-family:'Inter',Helvetica]"
                  >
                    {markingAllRead ? "Marking..." : "Mark all read"}
                  </button>
                )}
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5">
                {(["all", "unread", "read"] as NotificationStatus[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilterChange(f)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors [font-family:'Inter',Helvetica] ${
                      activeFilter === f
                        ? "bg-violet-500/20 text-violet-400"
                        : "text-[#6b7280] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Notification list */}
              <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {notifLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <svg className="w-5 h-5 text-violet-400 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <svg width="32" height="32" viewBox="0 0 18 18" fill="none" className="text-[#374151]">
                      <path d="M14 6C14 3.24 11.76 1 9 1C6.24 1 4 3.24 4 6C4 11 1 12.5 1 12.5H17C17 12.5 14 11 14 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10.73 15.5C10.39 16.06 9.74 16.5 9 16.5C8.26 16.5 7.61 16.06 7.27 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p className="text-xs text-[#6b7280] [font-family:'Inter',Helvetica]">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const isExpanded = expandedNotificationId === notification.id;
                    const isUnread = !notification.read_at;
                    const isNew = notification.data?.is_new;

                    const iconColor = notification.type.startsWith("security")
                      ? isNew
                        ? "text-amber-400 bg-amber-400/10"
                        : "text-emerald-400 bg-emerald-400/10"
                      : "text-violet-400 bg-violet-400/10";

                    const timeAgo = (() => {
                      const diff = Date.now() - new Date(notification.created_at).getTime();
                      const mins = Math.floor(diff / 60000);
                      if (mins < 1) return "Just now";
                      if (mins < 60) return `${mins}m ago`;
                      const hrs = Math.floor(mins / 60);
                      if (hrs < 24) return `${hrs}h ago`;
                      return `${Math.floor(hrs / 24)}d ago`;
                    })();

                    return (
                      <div key={notification.id}>
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/5 ${
                            isUnread ? "bg-violet-500/5" : ""
                          }`}
                        >
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${iconColor}`}>
                            {notification.type.startsWith("security") ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                {isNew ? (
                                  <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                ) : (
                                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                )}
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs font-semibold leading-snug [font-family:'Inter',Helvetica] ${isUnread ? "text-white" : "text-[#9ca3af]"}`}>
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-[10px] text-[#6b7280] [font-family:'Inter',Helvetica]">{timeAgo}</span>
                                {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />}
                              </div>
                            </div>
                            <p className="text-[11px] text-[#6b7280] mt-0.5 leading-relaxed [font-family:'Inter',Helvetica] line-clamp-2">
                              {notification.message}
                            </p>
                          </div>

                          {/* Expand chevron */}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`flex-shrink-0 mt-1 text-[#6b7280] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          >
                            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        {/* Expanded detail panel */}
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-[#0d0e14] border-t border-white/5">
                            <div className="mt-3 rounded-xl bg-[#1a1b23] border border-white/5 p-3 space-y-2">
                              {notification.data?.device && (
                                <div className="flex items-center gap-2">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#6b7280] flex-shrink-0">
                                    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
                                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                                  </svg>
                                  <span className="text-[11px] text-[#9ca3af] [font-family:'Inter',Helvetica]">Device:</span>
                                  <span className="text-[11px] text-white [font-family:'Inter',Helvetica]">{notification.data.device}</span>
                                </div>
                              )}
                              {notification.data?.ip_address && (
                                <div className="flex items-center gap-2">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#6b7280] flex-shrink-0">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                  </svg>
                                  <span className="text-[11px] text-[#9ca3af] [font-family:'Inter',Helvetica]">IP:</span>
                                  <span className="text-[11px] text-white [font-family:'Inter',Helvetica]">{notification.data.ip_address}</span>
                                </div>
                              )}
                              {notification.data?.location && (
                                <div className="flex items-center gap-2">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#6b7280] flex-shrink-0">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" />
                                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                                  </svg>
                                  <span className="text-[11px] text-[#9ca3af] [font-family:'Inter',Helvetica]">Location:</span>
                                  <span className="text-[11px] text-white [font-family:'Inter',Helvetica]">{notification.data.location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#6b7280] flex-shrink-0">
                                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                                <span className="text-[11px] text-[#9ca3af] [font-family:'Inter',Helvetica]">Time:</span>
                                <span className="text-[11px] text-white [font-family:'Inter',Helvetica]">
                                  {new Date(notification.created_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
          <button
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 bg-transparent border-none focus:outline-none"
            aria-label="Open profile menu"
            data-testid="button-profile-menu"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1a1b23] border border-white/10 flex items-center justify-center text-white text-xs font-bold [font-family:'Inter',Helvetica]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                  onError={() => setAvatarLoadError(true)}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white [font-family:'Inter',Helvetica] leading-4" data-testid="text-username">
                {displayName}
              </p>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#6b7280] hidden sm:block">
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1b23] border border-white/10 rounded-xl shadow-lg z-50">
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0d0e14] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Deactivate account</h2>
              <button onClick={closeDeactivateModal} className="text-sm text-[#9ca3af] hover:text-white">✕</button>
            </div>
            <p className="text-sm text-[#9ca3af] mb-4">
              Enter your current password to confirm deactivation. Your account will be logged out after deactivation.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Current password"
              className="w-full mb-3 rounded-lg border border-white/15 bg-[#1a1b23] px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
              data-testid="input-deactivate-password"
            />
            {localError && <p className="text-sm text-red-400 mb-2">{localError}</p>}
            {deactivateError && <p className="text-sm text-red-400 mb-2">{deactivateError}</p>}
            {deactivateMessage && <p className="text-sm text-emerald-300 mb-2">{deactivateMessage}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeactivateModal}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:border-white/30"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateSubmit}
                disabled={deactivateLoading}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deactivateLoading ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
