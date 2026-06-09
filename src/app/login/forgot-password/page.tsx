"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { forgotPassword } from "@/redux/thunk/forgotPasswordThunk";
import { resetPassword } from "@/redux/thunk/resetPasswordThunk";
import { resetForgotPassword } from "@/redux/slices/forgotPasswordSlice";
import { resetResetPassword } from "@/redux/slices/resetPasswordSlice";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading: sendingOtp, error: forgotError, message: forgotMessage, success: otpSent } =
    useAppSelector((state) => state.forgotPassword);
  const {
    loading: resetting,
    error: resetError,
    message: resetMessage,
    success: resetSuccess,
  } = useAppSelector((state) => state.resetPassword);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      dispatch(resetForgotPassword());
      dispatch(resetResetPassword());
    };
  }, [dispatch]);

  useEffect(() => {
    if (otpSent) {
      setStep(2);
      setLocalError(null);
    }
  }, [otpSent]);

  useEffect(() => {
    if (resetSuccess) {
      router.push("/login");
    }
  }, [resetSuccess, router]);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setLocalError("Please enter your email.");
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();
    } catch {
    
    }
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code.trim()) {
      setLocalError("Please enter the OTP code.");
      return;
    }

    setLocalError(null);
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim() || !passwordConfirmation.trim()) {
      setLocalError("Please enter and confirm your new password.");
      return;
    }

    if (password !== passwordConfirmation) {
      setLocalError("Passwords do not match.");
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
      // error is handled in state
    }
  };

  return (
    <div className="bg-[#0a0a18] min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: "#1a1a2e" }}>
        <h1 className="text-2xl font-semibold mb-2">Forgot Password</h1>

        {step === 1 && (
          <>
            <p className="text-gray-300 text-sm mb-6">Enter your email to receive a password reset OTP.</p>
            <form onSubmit={handleSendOtp} className="space-y-4">
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

              {(forgotError || localError) && (
                <p className="text-red-500 text-xs">{localError || forgotError}</p>
              )}
              {forgotMessage && <p className="text-green-400 text-xs">{forgotMessage}</p>}

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white font-semibold py-2.5 rounded-xl transition duration-200 hover:opacity-90 disabled:opacity-50"
              >
                {sendingOtp ? "Sending..." : "Send Reset OTP"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-300 text-sm mb-6">
              OTP has been sent to <span className="font-medium text-white">{email}</span>. Enter it below to continue.
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
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

              {(localError || forgotError) && <p className="text-red-500 text-xs">{localError || forgotError}</p>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white font-semibold py-2.5 rounded-xl transition duration-200 hover:opacity-90"
              >
                Verify OTP
              </button>
            </form>

            <div className="mt-4 text-sm text-gray-300 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-purple-300 hover:underline"
              >
                Change email
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-gray-300 text-sm mb-6">
              Set your new password. Your email is <span className="font-medium text-white">{email}</span> and OTP is saved.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
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

              {(localError || resetError) && <p className="text-red-500 text-xs">{localError || resetError}</p>}
              {resetMessage && <p className="text-green-400 text-xs">{resetMessage}</p>}

              <button
                type="submit"
                disabled={resetting}
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white font-semibold py-2.5 rounded-xl transition duration-200 hover:opacity-90 disabled:opacity-50"
              >
                {resetting ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-4 text-sm text-gray-300 text-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-purple-300 hover:underline"
              >
                Back to OTP
              </button>
            </div>
          </>
        )}

        <div className="mt-4 text-sm text-gray-300 text-center">
          <Link href="/login" className="text-purple-300 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
