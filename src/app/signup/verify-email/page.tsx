"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyEmail } from "@/redux/thunk/verifyEmailThunk";
import { resetVerifyEmailState } from "@/redux/slices/verifyEmailSlice";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error, success, message } = useAppSelector((state) => state.verifyEmail);

  useEffect(() => {
    dispatch(resetVerifyEmailState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      router.push("/login");
    }
  }, [success, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) return;
    dispatch(verifyEmail({ email, code }));
  };

  return (
    <div className="bg-[#0b0b1a] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[rgba(24,24,44,0.85)] border border-white/10 p-8">
        <h1 className="text-white text-3xl font-bold mb-6">Verify Email</h1>

        <p className="text-sm text-gray-300 mb-5">
          Enter the code sent to <span className="font-semibold text-white">{email || "your email"}</span>.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#23233d] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl bg-[#23233d] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white transition hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{message || "Email verification successful! Redirecting to login..."}</p>}
        </form>

        <div className="mt-5 text-center text-gray-400 text-sm">
          <p>
            Didn’t get a code? <Link href="/signup" className="text-purple-400 hover:underline">Go back to signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
