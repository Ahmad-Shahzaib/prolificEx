'use client';

import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTwoFactorStatus, setupTwoFactor, confirmTwoFactor, disableTwoFactor } from "@/redux/thunk/twoFactorThunk";
import { fetchSessions, revokeSession } from "@/redux/thunk/sessionsThunk";

export default function SecurityPage() {
  const dispatch = useAppDispatch();
  const {
    enabled: isTwoFactorEnabled,
    loading: twoFactorLoading,
    error: twoFactorError,
    setupLoading,
    setupError,
    confirmLoading,
    disableLoading,
    confirmError,
    confirmMessage,
    setupQrUrl,
    setupManualEntryKey,
    setupIssuer,
    setupAccount,
  } = useAppSelector((state) => state.twoFactor);
  const {
    loading: sessionsLoading,
    error: sessionsError,
    revokeLoadingId,
    revokeError,
    sessions,
    message: sessionsMessage,
  } = useAppSelector((state) => state.sessions);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  const handleDisableTwoFactor = async () => {
    if (!otpCode.trim()) return;
    try {
      await dispatch(disableTwoFactor({ code: otpCode.trim() })).unwrap();
      setShowDisableConfirm(false);
      setOtpCode("");
      dispatch(fetchTwoFactorStatus());
    } catch {
      // error handled by Redux state
    }
  };

  useEffect(() => {
    dispatch(fetchTwoFactorStatus());
    dispatch(fetchSessions());
  }, [dispatch]);

  return (
    <PageShell title="Security" description="Manage your account security settings.">
      <div className="space-y-6 px-4 sm:px-0">

        {/* Change Password */}
        <Card className="bg-[#111218] border border-white/5 rounded-3xl">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-white text-xl font-semibold mb-6">Change Password</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[#6b7280] text-sm block mb-2">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#6b7280] text-sm block mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button className="bg-violet-600 hover:bg-violet-700 px-10 py-3 rounded-2xl text-white font-medium w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="bg-[#111218] border border-white/5 rounded-3xl">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-white text-xl font-semibold mb-6">Two-Factor Authentication</h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0 flex justify-center lg:justify-start">
                {setupQrUrl ? (
                  <div className="bg-white/5 p-6 rounded-2xl inline-block w-[180px] h-[180px] flex items-center justify-center text-center">
                    <p className="text-[#6b7280] text-sm">
                      Your QR code is shown in the setup details below.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-2xl inline-block">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=2FA-Example"
                      alt="QR Code"
                      className="w-[180px] h-[180px]"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {twoFactorLoading
                        ? "Checking 2FA status..."
                        : isTwoFactorEnabled
                        ? "Two-factor authentication enabled"
                        : "Two-factor authentication disabled"
                      }
                    </p>
                    <p className="text-[#6b7280] text-sm mt-1">
                      {twoFactorLoading
                        ? "Retrieving your current 2FA state from the API."
                        : isTwoFactorEnabled
                        ? "Use your authenticator app to approve sign-in requests."
                        : "Enable 2FA to secure your account."
                      }
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isTwoFactorEnabled}
                    onClick={() => {
                      if (!isTwoFactorEnabled) {
                        setShowDisableConfirm(false);
                        dispatch(setupTwoFactor());
                      } else {
                        setShowDisableConfirm(true);
                      }
                    }}
                    className={`relative inline-flex h-10 w-16 shrink-0 items-center rounded-full border transition-colors duration-200 ${isTwoFactorEnabled ? "border-emerald-400/50 bg-emerald-500/20" : "border-white/10 bg-white/10"}`}
                  >
                    <span className={`absolute left-1 h-8 w-8 rounded-full bg-white shadow-lg transition-transform duration-200 ${isTwoFactorEnabled ? "translate-x-6" : "translate-x-0"}`} />
                    <span className="sr-only">Toggle two-factor authentication</span>
                  </button>
                </div>
                <div className="text-sm text-[#6b7280]">
                  {twoFactorLoading || setupLoading
                    ? "Loading your 2FA status..."
                    : isTwoFactorEnabled
                    ? "Two-factor authentication is active."
                    : "Click the toggle to generate a new 2FA setup code."
                  }
                </div>
                {twoFactorError ? (
                  <div className="text-sm text-rose-400">{twoFactorError}</div>
                ) : null}
                {setupError ? (
                  <div className="text-sm text-rose-400">{setupError}</div>
                ) : null}
              </div>
            </div>

            {showDisableConfirm && isTwoFactorEnabled ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-[#1a1b23] p-5">
                <p className="text-white text-sm font-medium">Disable two-factor authentication</p>
                <p className="text-[#6b7280] text-sm mt-2">Enter the code from your authenticator app to disable 2FA.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value)}
                    placeholder="Enter OTP code"
                    className="w-full bg-[#111218] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-white/30"
                  />
                  <Button
                    type="button"
                    onClick={handleDisableTwoFactor}
                    disabled={disableLoading || !otpCode.trim()}
                    className="bg-rose-600 hover:bg-rose-700 px-6 py-3 rounded-2xl text-white font-medium"
                  >
                    {disableLoading ? "Disabling..." : "Disable 2FA"}
                  </Button>
                </div>
                {twoFactorError ? (
                  <div className="mt-3 text-sm text-rose-400">{twoFactorError}</div>
                ) : null}
              </div>
            ) : null}

            {setupQrUrl ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-[#111218] p-5">
                <p className="text-white text-sm font-medium">2FA setup details</p>
                <p className="text-[#6b7280] text-sm mt-2">Scan the QR code below with your authenticator app, or use the manual entry key.</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-4 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupQrUrl)}`}
                      alt="2FA QR Code"
                      className="mx-auto h-[180px] w-[180px]"
                    />
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-[#6b7280] text-xs uppercase tracking-[0.2em]">Manual entry key</p>
                    <p className="mt-2 break-all text-white">{setupManualEntryKey}</p>
                    <p className="mt-4 text-[#6b7280] text-sm">Issuer: {setupIssuer}</p>
                    <p className="text-[#6b7280] text-sm">Account: {setupAccount}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-3xl border border-white/10 bg-[#1a1b23] p-5">
                  <p className="text-white text-sm font-medium">Confirm 2FA setup</p>
                  <p className="text-[#6b7280] text-sm mt-2">Enter the code shown in your authenticator app to activate two-factor authentication.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(event) => setOtpCode(event.target.value)}
                      placeholder="Enter OTP code"
                      className="w-full bg-[#111218] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-white/30"
                    />
                    <Button
                      type="button"
                      onClick={() => dispatch(confirmTwoFactor({ code: otpCode }))}
                      disabled={confirmLoading || !otpCode.trim()}
                      className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-2xl text-white font-medium"
                    >
                      {confirmLoading ? "Confirming..." : "Confirm"}
                    </Button>
                  </div>
                  {confirmError ? (
                    <div className="mt-3 text-sm text-rose-400">{confirmError}</div>
                  ) : null}
                  {confirmMessage ? (
                    <div className="mt-3 text-sm text-emerald-400">{confirmMessage}</div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Login Sessions */}
        <Card className="bg-[#111218] border border-white/5 rounded-3xl">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-white text-xl font-semibold mb-6">Login Sessions</h2>
            <div className="text-sm text-[#6b7280] mb-4">
              {sessionsLoading
                ? "Loading active login sessions..."
                : sessionsError
                ? sessionsError
                : sessions.length === 0
                ? "No active sessions found."
                : `${sessions.length} active session${sessions.length === 1 ? "" : "s"}`}
            </div>
            {revokeError ? <div className="text-sm text-rose-400 mb-4">{revokeError}</div> : null}
            {sessionsMessage ? <div className="text-sm text-emerald-400 mb-4">{sessionsMessage}</div> : null}

            {sessions.length > 0 ? (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 text-[#6b7280] text-sm font-medium">Device</th>
                        <th className="text-left py-4 text-[#6b7280] text-sm font-medium">Location</th>
                        <th className="text-left py-4 text-[#6b7280] text-sm font-medium">Last Active</th>
                        <th className="text-right py-4 text-[#6b7280] text-sm font-medium pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.id} className="border-b border-white/10">
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-[#6b7280] text-sm">
                                {session.device.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="text-white">{session.device}</p>
                                {session.is_current ? (
                                  <p className="text-emerald-400 text-xs mt-1">Current session</p>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-white">
                            <p>{session.location || "Unknown location"}</p>
                            <p className="text-[#6b7280] text-sm mt-1">{session.ip_address}</p>
                          </td>
                          <td className="py-5 text-white">
                            {new Date(session.last_active_at).toLocaleString()}
                          </td>
                          <td className="py-5 text-right">
                            {session.is_current ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled
                                className="bg-white/10 text-white px-6 py-2 rounded-xl"
                              >
                                Current
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => dispatch(revokeSession({ id: session.id }))}
                                disabled={revokeLoadingId === session.id}
                                className="bg-white/10 hover:bg-white/15 text-white px-6 py-2 rounded-xl"
                              >
                                {revokeLoadingId === session.id ? "Revoking..." : "Revoke"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-[#1a1b23] border border-white/10 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-[#6b7280] text-sm">
                          {session.device.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="text-white font-medium">{session.device}</p>
                          <p className="text-white/70 text-sm">{session.location || session.ip_address}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <p className="text-white/70 text-sm">{new Date(session.last_active_at).toLocaleString()}</p>
                          {session.is_current ? (
                            <p className="text-emerald-400 text-xs mt-1">Current session</p>
                          ) : null}
                        </div>
                        {session.is_current ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled
                            className="bg-white/10 text-white px-6 py-2 rounded-xl"
                          >
                            Current
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => dispatch(revokeSession({ id: session.id }))}
                            disabled={revokeLoadingId === session.id}
                            className="bg-white/10 hover:bg-white/15 text-white px-6 py-2 rounded-xl"
                          >
                            {revokeLoadingId === session.id ? "Revoking..." : "Revoke"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

   

      </div>
    </PageShell>
  );
}