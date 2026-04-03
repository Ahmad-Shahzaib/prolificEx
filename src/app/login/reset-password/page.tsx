"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetPassword } from "@/redux/thunk/resetPasswordThunk";
import { resetResetPassword } from "@/redux/slices/resetPasswordSlice";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, message, success } = useAppSelector((state) => state.resetPassword);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (success) {
      router.push("/login");
    }
  }, [success, router]);

  useEffect(() => {
    return () => {
      dispatch(resetResetPassword());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !code.trim() || !password.trim() || !passwordConfirmation.trim()) {
      return;
    }

    if (password !== passwordConfirmation) {
      return;
    }

    try {
      await dispatch(
        resetPassword({
          email,
          code,
          password,
          password_confirmation: passwordConfirmation,
        })
      ).unwrap();
    } catch {
      // error state already updated
    }
  };

  return (
    <div className="bg-[#0a0a18] min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: "#1a1a2e" }}>
        <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
        <p className="text-gray-300 text-sm mb-6">Enter your email, OTP code, and new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#12122a] border border-[#2a2a4a] text-white focus:outline-none focus:border-[#7c3aed]"
              placeholder="your-email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">OTP Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#12122a] border border-[#2a2a4a] text-white focus:outline-none focus:border-[#7c3aed]"
              placeholder="e.g. 948020"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#12122a] border border-[#2a2a4a] text-white focus:outline-none focus:border-[#7c3aed]"
              placeholder="New password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#12122a] border border-[#2a2a4a] text-white focus:outline-none focus:border-[#7c3aed]"
              placeholder="Confirm new password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-400 text-xs">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white font-semibold py-2.5 rounded-xl transition duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
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
