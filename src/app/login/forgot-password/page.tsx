"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { forgotPassword } from "@/redux/thunk/forgotPasswordThunk";
import { resetForgotPassword } from "@/redux/slices/forgotPasswordSlice";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, message, success } = useAppSelector((state) => state.forgotPassword);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (success) {
      router.push("/login/reset-password");
    }

    return () => {
      dispatch(resetForgotPassword());
    };
  }, [success, dispatch, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await dispatch(forgotPassword({ email })).unwrap();
    } catch {
      // error is already in state, no-op
    }
  };

  return (
    <div className="bg-[#0a0a18] min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: "#1a1a2e" }}>
        <h1 className="text-2xl font-semibold mb-2">Forgot Password</h1>
        <p className="text-gray-300 text-sm mb-6">Enter your email to receive a password reset OTP.</p>

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

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {message && <p className="text-green-400 text-xs">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white font-semibold py-2.5 rounded-xl transition duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset OTP"}
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
