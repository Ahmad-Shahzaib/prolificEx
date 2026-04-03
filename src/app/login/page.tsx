"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/thunk/loginThunk";
import { resetAuthError } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const userEmail = user?.email?.toLowerCase() || "";
      const isAdmin = userEmail.startsWith("admin") || userEmail.includes("@admin");
      router.push(isAdmin ? "/admin/dashboard" : "/dashboard");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    return () => {
      if (error) dispatch(resetAuthError());
    };
  }, [dispatch, error]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ identifier, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        // success will be handled by isAuthenticated effect
      }
    } catch {
      // thunk sets error state automatically
    }
  };

  return (
    <div className="bg-[#0a0a18] overflow-hidden w-full min-h-screen relative flex flex-col items-center justify-start">
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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

      {/* Logo and tagline */}
      <div className="flex flex-col items-center justify-center w-full z-10 mt-14 mb-8">
        <div className="flex items-center gap-2">
          <Image
            src="/figmaAssets/h8fhoaokhdjquwmkrvnczlagvyrx5x-2.png"
            alt="Prolific Logo"
            width={100}
            height={100}
          />
       
        </div>
      </div>

      {/* Login Card */}
      <div className="flex items-center justify-center z-10 w-full px-4">
        <div
          className="rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col"
          style={{ backgroundColor: "#1a1a2e" }}
        >
          <h2 className="text-white text-xl font-semibold mb-6">Login</h2>


          <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
            {/* Email or Username */}
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Email or Username</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 rounded-xl text-white text-sm focus:outline-none transition-all duration-200"
                style={{
                  backgroundColor: "#12122a",
                  border: "1.5px solid #7c3aed",
                  color: "white",
                }}
                placeholder="Enter your email or username"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                onFocus={e => (e.target.style.borderColor = "#7c3aed")}
                onBlur={e => (e.target.style.borderColor = "#2a2a4a")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2.5 pr-10 rounded-xl text-white text-sm focus:outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "#12122a",
                    border: "1.5px solid #2a2a4a",
                    color: "white",
                  }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "#7c3aed")}
                  onBlur={e => (e.target.style.borderColor = "#2a2a4a")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-xs">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5 rounded-xl mt-1 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: "linear-gradient(90deg, #7c3aed, #9333ea)" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="mt-2 text-right">
              <Link href="/login/forgot-password" className="text-xs text-purple-300 hover:underline">
                Forgot password?
              </Link>
            </div>

            {user && (
              <div className="text-xs text-green-400 mt-2">Logged in as: {user.full_name}</div>
            )}
          </form>

          {/* Divider */}
          <div className="w-full flex items-center my-5">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="mx-3 text-gray-500 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Social Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            <button
              className="w-full flex items-center justify-center gap-2.5 text-white text-sm py-2.5   rounded-xl transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: "#12122a", border: "1px solid #2a2a4a" }}
            >
              {/* Google icon */}
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611 20.083H42V20H24v8h11.303C33.976 32.213 29.418 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.804 0 5.354 1.063 7.29 2.796l5.657-5.657C33.963 7.333 29.261 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.804 0 5.354 1.063 7.29 2.796l5.657-5.657C33.963 7.333 29.261 5 24 5 16.318 5 9.656 8.956 6.306 14.691z" fill="#FF3D00"/>
                <path d="M24 45c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 36.099 26.715 37 24 37c-5.398 0-9.948-3.672-11.29-8.624l-6.522 5.025C9.505 41.556 16.227 45 24 45z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24v8h11.303a11.944 11.944 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 25c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
              </svg>
              Continue with Google
            </button>

            <button
              className="w-full flex items-center justify-center gap-2.5 text-white text-sm py-2.5   rounded-xl transition-all duration-200 hover:opacity-80"
              style={{ backgroundColor: "#12122a", border: "1px solid #2a2a4a" }}
            >
              {/* Apple icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 814 1000" fill="white">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.1 134.7-316.5 267.5-316.5 100.6 0 164 43.5 219.2 43.5 52.3 0 125.6-47.3 236.5-47.3 41.3 0 148.1 6.7 227.7 93.5zm-189.3-127.9c-37.2 40.5-98.7 71.6-157.5 71.6-6.7 0-13.5-.6-20.2-1.9-1.3-6.7-1.9-13.5-1.9-20.8 0-43.5 20.2-89.5 56.7-126.5 37.8-37.8 100-65 157.4-66.6 1.3 7.4 1.9 14.7 1.9 22.7 0 43.5-18.3 88.5-36.4 121.5z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Sign up */}
          <div className="mt-6 text-gray-500 text-sm text-center">
            Don&apos;t Have An Account?{" "}
            <Link href="/signup" className="text-purple-400 hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}