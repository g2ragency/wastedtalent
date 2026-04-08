"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface LoginContentProps {
  contactInfo?: ContactInfo;
}

export default function LoginContent({ contactInfo }: LoginContentProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Please enter your e-mail address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid e-mail address";
    }

    if (!password) {
      newErrors.password = "Please enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");

    if (!validate()) return;

    setIsSubmitting(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      router.push("/");
    } else {
      setApiError(result.message || "Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-3 md:px-6">
          <div className="max-w-[500px] mx-auto">
            <h1
              className="text-center mb-10"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontWeight: 300,
              }}
            >
              Login
            </h1>

            <form onSubmit={handleSubmit} noValidate>
              {/* API Error */}
              {apiError && (
                <div
                  className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded"
                  style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                >
                  {apiError}
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="w-full px-4 py-3 border-0 text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    backgroundColor: "#F2F2F2",
                  }}
                />
                {errors.email && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      handleFieldChange("password", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border-0 text-sm focus:outline-none transition-colors"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      backgroundColor: "#F2F2F2",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#222222] transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
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
                </div>
                {errors.password && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#222222] cursor-pointer"
                  />
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      color: "#222222",
                    }}
                  >
                    Ricordami
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm hover:opacity-60 transition-opacity"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    color: "#222222",
                  }}
                >
                  Password dimenticata?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#222222] text-white py-4 font-bold text-sm uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </form>

            <p
              className="text-center mt-6 text-sm"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#222222",
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="underline font-bold hover:opacity-60 transition-opacity"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer contactInfo={contactInfo} />
    </>
  );
}
