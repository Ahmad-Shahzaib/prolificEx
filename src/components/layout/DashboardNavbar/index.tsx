"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/providers/SidebarContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserProfile, deactivateUserAccount } from "@/redux/thunk/profileThunk";
import { logout } from "@/redux/slices/authSlice";

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
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

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

        <button data-testid="button-notifications" aria-label="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1b23] text-[#6b7280] hover:text-white transition-colors cursor-pointer border-none">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 6C14 3.24 11.76 1 9 1C6.24 1 4 3.24 4 6C4 11 1 12.5 1 12.5H17C17 12.5 14 11 14 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.73 15.5C10.39 16.06 9.74 16.5 9 16.5C8.26 16.5 7.61 16.06 7.27 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full"></span>
        </button>

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
