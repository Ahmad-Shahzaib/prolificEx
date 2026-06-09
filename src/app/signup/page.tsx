"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/thunk/registerThunk";
import { socialLogin } from "@/redux/thunk/socialLoginThunk";
import { resetRegisterState } from "@/redux/slices/registerSlice";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup" | "redirect";
          }) => void;
          prompt: (momentListener?: (notification: {
            isDisplayed: () => boolean;
            isNotDisplayed: () => boolean;
            isDismissedMoment: () => boolean;
          }) => void) => void;
        };
      };
    };
  }
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Initial form state
  const initialFormState = {
    full_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    country: "Nigeria",
  };

  const [form, setForm] = useState(initialFormState);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading: registerLoading, error: registerError, success, message } = useAppSelector(
    (state) => state.register
  );
  const { loading: authLoading, error: authError, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );
  const isPageLoading = registerLoading || authLoading || googleLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (form.password !== form.password_confirmation) {
      setLocalError('Passwords do not match');
      return;
    }

    dispatch(registerUser(form));
  };

  const handleGoogleSignup = () => {
    if (!googleClientId) {
      alert("Google signup is not configured. Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
      return;
    }

    if (!window.google?.accounts?.id || !googleReady) {
      alert("Google signup is still loading. Please try again in a moment.");
      return;
    }

    setGoogleLoading(true);
    window.google.accounts.id.prompt((notification: any) => {
      if (
        notification.isDisplayed() ||
        notification.isNotDisplayed() ||
        notification.isDismissedMoment()
      ) {
        setGoogleLoading(false);
      }
    });
  };

  // Redirect to verification page when registration is successful
  useEffect(() => {
    if (success) {
      router.push(`/signup/verify-email?email=${encodeURIComponent(form.email)}`);
    }
  }, [success, router, form.email]);

  // Reset Redux state on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const userEmail = user?.email?.toLowerCase() || "";
      const isAdmin = userEmail.startsWith("admin") || userEmail.includes("@admin");
      router.push(isAdmin ? "/admin/dashboard" : "/dashboard");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (!googleClientId || typeof window === "undefined") return;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        ux_mode: "popup",
        callback: async ({ credential }) => {
          if (!credential) return;

          const resultAction = await dispatch(
            socialLogin({ provider: "google", id_token: credential })
          );

          if (socialLogin.fulfilled.match(resultAction)) {
            const data = resultAction.payload.data as { requires_2fa?: boolean };
            if (data?.requires_2fa) {
              window.location.href = "/login/otp";
            }
          }

          setGoogleLoading(false);
        },
      });

      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle, { once: true });
      return () => existingScript.removeEventListener("load", initializeGoogle);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [dispatch, googleClientId]);

  useEffect(() => {
    dispatch(resetRegisterState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reusable Eye Toggle Component
  const EyeToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
      tabIndex={-1}
    >
      {show ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="bg-[#0b0b1a] overflow-hidden w-full min-h-screen relative flex flex-col">
      {/* Starfield background */}
      <div className="absolute inset-0 z-0">
        <Image
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Background"
          src="/figmaAssets/image.png"
          fill
          priority
        />
        <Image
          className="absolute top-0 left-0 w-full max-w-[1031px] h-auto z-0"
          alt="Background overlay"
          src="/figmaAssets/image-1.png"
          width={1031}
          height={806}
          priority
        />
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center justify-center w-full z-10 pt-8 pb-4">
        <Image
          src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2.png"
          alt="Prolific Logo"
          width={120}
          height={48}
          priority
        />
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center z-10 px-4 pb-10">
        <div
          className="rounded-2xl shadow-2xl px-10 py-10 w-full flex flex-col items-center"
          style={{
            background: "rgba(24, 24, 44, 0.85)",
            maxWidth: "520px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h2 className="text-white text-3xl font-bold mb-8 tracking-wide">
            Sign Up
          </h2>

          <form
            className="w-full flex flex-col gap-5"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            {/* Full Name */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "#23233d" }}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "#23233d" }}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: "#23233d" }}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 pr-10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "#23233d" }}
                  placeholder="Enter your password"
                  required
                />
                <EyeToggle
                  show={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-5 py-3 pr-10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: "#23233d" }}
                  placeholder="Confirm your password"
                  required
                />
                <EyeToggle
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((prev) => !prev)}
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full font-bold py-3 rounded-xl text-white text-base mt-1 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{
                background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)",
              }}
              disabled={registerLoading || authLoading}
            >
              {registerLoading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Feedback Messages */}
            {localError && (
              <div className="text-red-400 text-sm mt-2 text-center">
                {localError}
              </div>
            )}
            {registerError && (
              <div className="text-red-400 text-sm mt-2 text-center">
                {registerError}
              </div>
            )}
            {authError && (
              <div className="text-red-400 text-sm mt-2 text-center">
                {authError}
              </div>
            )}
            {success && (
              <div className="text-green-400 text-sm mt-2 text-center">
                {message || "Account created successfully!"}
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="w-full flex items-center my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.12)" }}
            />
            <span className="mx-3 text-gray-500 text-xs">or continue with</span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.12)" }}
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 mb-4">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={registerLoading || authLoading || googleLoading}
              className="w-full flex items-center justify-center gap-2.5 text-white text-sm py-2.5 rounded-xl transition-all duration-200 hover:opacity-80 disabled:opacity-60"
              style={{ backgroundColor: "#12122a", border: "1px solid #2a2a4a" }}
            >
              {googleLoading ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M43.611 20.083H42V20H24v8h11.303C33.976 32.213 29.418 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.804 0 5.354 1.063 7.29 2.796l5.657-5.657C33.963 7.333 29.261 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                  <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.804 0 5.354 1.063 7.29 2.796l5.657-5.657C33.963 7.333 29.261 5 24 5 16.318 5 9.656 8.956 6.306 14.691z" fill="#FF3D00"/>
                  <path d="M24 45c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 36.099 26.715 37 24 37c-5.398 0-9.948-3.672-11.29-8.624l-6.522 5.025C9.505 41.556 16.227 45 24 45z" fill="#4CAF50"/>
                  <path d="M43.611 20.083H42V20H24v8h11.303a11.944 11.944 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 25c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                </svg>
              )}
              {googleLoading ? "Opening Google..." : "Continue with Google"}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      {isPageLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-[#111125] bg-opacity-95 border border-white/10 p-6 shadow-xl">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-sm text-white">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
}