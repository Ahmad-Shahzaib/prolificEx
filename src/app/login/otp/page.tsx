"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyTwoFactorLogin } from "@/redux/thunk/verifyTwoFactorThunk";

export default function OtpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [code, setCode] = useState("");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Read the pending token once from sessionStorage after mount.
  // No cleanup — deliberately avoid clearing on unmount so React Strict Mode's
  // double-invoke does not wipe the token before the page can render.
  useEffect(() => {
    const token = sessionStorage.getItem("pending2faToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    setPendingToken(token);
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect to dashboard once OTP is verified and auth state is set.
  useEffect(() => {
    if (isAuthenticated) {
      const userEmail = user?.email?.toLowerCase() || "";
      const isAdmin = userEmail.startsWith("admin") || userEmail.includes("@admin");
      router.replace(isAdmin ? "/admin/dashboard" : "/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code.trim() || !pendingToken) return;
    try {
      await dispatch(
        verifyTwoFactorLogin({ pending_token: pendingToken, code: code.trim() })
      ).unwrap();
    } catch {
      // error is set in Redux state by the thunk
    }
  };

  // Don't render the form until we've confirmed the token exists in sessionStorage.
  if (!ready) return null;

  return (
    <div className="bg-[#0a0a18] min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: "#1a1a2e" }}>
        <h1 className="text-2xl font-semibold mb-2">Two-Factor Authentication</h1>
        <p className="text-gray-300 text-sm mb-6">
          Enter the OTP code from your authenticator app to complete login.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">OTP Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#12122a] border border-[#2a2a4a] text-white focus:outline-none focus:border-[#7c3aed]"
              placeholder="123456"
              autoFocus
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white font-semibold py-2.5 rounded-xl transition duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-300 text-center">
          <Link href="/login" className="text-purple-300 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
