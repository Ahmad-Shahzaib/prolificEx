'use client';

import React, { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserProfile, updateUserProfile, uploadUserAvatar, changeUserPassword, deactivateUserAccount } from "@/redux/thunk/profileThunk";
import { clearProfileMessages } from "@/redux/slices/profileSlice";
import { logout } from "@/redux/slices/authSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { profile, loading, error, message, avatarUploadError, avatarUploadMessage, passwordChangeLoading, passwordChangeError, passwordChangeMessage, deactivateLoading, deactivateError, deactivateMessage } = useAppSelector((state) => state.profile);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "deactivate">("profile");
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [deactivateLocalError, setDeactivateLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setDisplayName(profile.full_name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setCountry(profile.country || "");
    }
  }, [profile]);

  useEffect(() => {
    if (message || avatarUploadMessage || error || avatarUploadError || passwordChangeMessage || passwordChangeError || deactivateMessage || deactivateError) {
      const timer = setTimeout(() => {
        dispatch(clearProfileMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [dispatch, message, avatarUploadMessage, error, avatarUploadError, passwordChangeMessage, passwordChangeError]);

  const handleSave = () => {
    dispatch(
      updateUserProfile({
        full_name: displayName,
        username,
        email,
        phone,
        country,
      })
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return; // UI can show warning, but we keep this simple and rely on server error too
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    dispatch(
      changeUserPassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })
    ).then((action: any) => {
      if (action.meta.requestStatus === "fulfilled") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  const openDeactivateModal = () => {
    setDeactivatePassword("");
    setDeactivateLocalError(null);
    setIsDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    setIsDeactivateModalOpen(false);
    setDeactivatePassword("");
    setDeactivateLocalError(null);
  };

  const handleDeactivateAccount = async () => {
    if (!deactivatePassword.trim()) {
      setDeactivateLocalError("Please enter your current password.");
      return;
    }

    try {
      await dispatch(deactivateUserAccount({ password: deactivatePassword.trim() })).unwrap();
      dispatch(logout());
      router.push("/");
    } catch (err: any) {
      setDeactivateLocalError(typeof err === "string" ? err : "Failed to deactivate account.");
    }
  };

  return (
    <PageShell title="Settings" description="Manage your account preferences.">
      <Card className="bg-[#111218] border border-white/5 rounded-3xl overflow-hidden">
        <CardContent className="p-10">
          <div className="mb-6 flex items-center gap-1 rounded-2xl border border-white/10 bg-[#0f1017] p-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "profile" ? "bg-[#111218] text-white border border-violet-400" : "text-[#9ca3af] hover:text-white"}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "password" ? "bg-[#111218] text-white border border-violet-400" : "text-[#9ca3af] hover:text-white"}`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("deactivate")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === "deactivate" ? "bg-[#111218] text-white border border-violet-400" : "text-[#9ca3af] hover:text-white"}`}
            >
              Deactivate Account
            </button>
          </div>

          {activeTab === "profile" && (
            <div className="flex flex-col md:flex-row gap-10">
              {/* Profile Photo Section */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div
                className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/10 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile Photo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-[#1a1b23] text-white text-2xl font-bold">
                    {(() => {
                      const name = profile?.username || profile?.full_name || "";
                      const parts = name.split(" ").filter(Boolean);
                      if (parts.length >= 2) {
                        return `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`;
                      }
                      if (parts.length === 1) {
                        return parts[0].slice(0, 2).toUpperCase();
                      }
                      return "AR";
                    })()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                  Click to change
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedAvatar(e.target.files[0]);
                    dispatch(uploadUserAvatar(e.target.files[0]));
                  }
                }}
              />

            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {error && (
                <div className="text-red-500 text-sm">Error: {error}</div>
              )}
              {avatarUploadError && (
                <div className="text-red-500 text-sm">Avatar upload failed: {avatarUploadError}</div>
              )}
              {message && !loading && !error && (
                <div className="text-green-400 text-sm">{message}</div>
              )}
              {avatarUploadMessage && !loading && !avatarUploadError && (
                <div className="text-green-400 text-sm">{avatarUploadMessage}</div>
              )}
              {loading && <div className="text-sm text-gray-300">Loading...</div>}

              {/* Username */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Phone Number</label>
                <div className="flex bg-[#1a1b23] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 border-r border-white/10">
                    {/* <span className="text-xl">🇺🇸</span> */}
                    {/* <span className="text-white">+</span> */}
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-transparent px-5 py-3.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-[#6b7280] text-sm mb-2">Country</label>
                <div className="flex items-center bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5">
                  <span className="text-xl mr-3">{profile?.country === "Ghana" ? "🇬🇭" : ""}</span>
                  <span className="text-white">{country || ""}</span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-3.5 rounded-2xl font-medium"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
          )}

          {activeTab === "password" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
              {passwordChangeError && <div className="text-red-500 text-sm">Password change failed: {passwordChangeError}</div>}
              {passwordChangeMessage && <div className="text-green-400 text-sm">{passwordChangeMessage}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-[#6b7280] text-sm mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[#6b7280] text-sm mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[#6b7280] text-sm mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-2xl font-medium"
                    onClick={handleChangePassword}
                    disabled={passwordChangeLoading}
                  >
                    {passwordChangeLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "deactivate" && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-white">Deactivate Account</h2>
              {deactivateError && <div className="text-red-500 text-sm">{deactivateError}</div>}
              {deactivateMessage && <div className="text-green-400 text-sm">{deactivateMessage}</div>}
              {deactivateLocalError && <div className="text-red-400 text-sm">{deactivateLocalError}</div>}
              <p className="text-[#9ca3af] text-sm">This will disable your account and log you out permanently. This action is not reversible.</p>
              <div className="flex justify-end">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-2xl font-medium"
                  onClick={openDeactivateModal}
                >
                  Deactivate Account
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0d0e14] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Deactivate Account</h2>
              <button onClick={closeDeactivateModal} className="text-sm text-[#9ca3af] hover:text-white">✕</button>
            </div>
            <p className="text-sm text-[#9ca3af] mb-4">
              Enter your password to confirm deactivation. This will log you out and disable your account.
            </p>
            <input
              type="password"
              value={deactivatePassword}
              onChange={(e) => setDeactivatePassword(e.target.value)}
              placeholder="Current password"
              className="w-full mb-3 rounded-lg border border-white/15 bg-[#1a1b23] px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
            />
            {deactivateLocalError && <p className="text-sm text-red-400 mb-2">{deactivateLocalError}</p>}
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
                onClick={handleDeactivateAccount}
                disabled={deactivateLoading}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deactivateLoading ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}