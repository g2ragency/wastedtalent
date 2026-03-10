"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ForgotPasswordContentProps {
  contactInfo?: ContactInfo;
}

export default function ForgotPasswordContent({
  contactInfo,
}: ForgotPasswordContentProps) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email.trim()) {
      setError("Please enter your e-mail address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid e-mail address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const result = await forgotPassword(email);

    // Always show success to prevent email enumeration
    setSuccess(true);
    setIsSubmitting(false);

    if (!result.success) {
      console.error("Forgot password error:", result.message);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (submitted) {
      setError("");
    }
  };

  if (success) {
    return (
      <>
        <main className="min-h-screen bg-white pt-32 pb-16">
          <div className="w-full px-3 md:px-6">
            <div className="max-w-[500px] mx-auto text-center">
              <h1
                className="mb-6"
                style={{
                  fontSize: "40px",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontWeight: 300,
                }}
              >
                Check your email
              </h1>

              <p
                className="text-sm mb-8"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  color: "#666666",
                  lineHeight: 1.6,
                }}
              >
                If an account exists for <strong>{email}</strong>, you will
                receive an email with instructions on how to reset your
                password.
              </p>

              <Link
                href="/login"
                className="inline-block bg-[#222222] text-white px-8 py-4 font-bold text-sm uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </main>
        <Footer contactInfo={contactInfo} />
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-3 md:px-6">
          <div className="max-w-[500px] mx-auto">
            <h1
              className="text-center mb-4"
              style={{
                fontSize: "40px",
                fontFamily: "Helvetica Neue, sans-serif",
                fontWeight: 300,
              }}
            >
              Reset Password
            </h1>

            <p
              className="text-center text-sm mb-10"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#666666",
              }}
            >
              Enter your e-mail address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="w-full px-4 py-3 border-0 text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    backgroundColor: "#F2F2F2",
                  }}
                />
                {error && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                  >
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#222222] text-white py-4 font-bold text-sm uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Loading..." : "Send Reset Link"}
              </button>
            </form>

            <p
              className="text-center mt-6 text-sm"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#222222",
              }}
            >
              Remember your password?{" "}
              <Link
                href="/login"
                className="underline font-bold hover:opacity-60 transition-opacity"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer contactInfo={contactInfo} />
    </>
  );
}
