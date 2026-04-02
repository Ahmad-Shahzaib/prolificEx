"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/thunk/registerThunk";
import { resetRegisterState } from "@/redux/slices/registerSlice";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const dispatch = useAppDispatch();
  const { loading, error, success, message } = useAppSelector(
    (state) => state.register
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  // Reset form when registration is successful
  useEffect(() => {
    if (success) {
      setForm(initialFormState);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [success]);

  // Reset Redux state on component mount
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
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Feedback Messages */}
            {error && (
              <div className="text-red-400 text-sm mt-2 text-center">
                {error}
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
    </div>
  );
}