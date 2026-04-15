"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { ContactInfo } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface RegisterContentProps {
  contactInfo?: ContactInfo;
}

interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export default function RegisterContent({ contactInfo }: RegisterContentProps) {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: RegisterErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Please enter your first name";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Please enter your last name";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your e-mail address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid e-mail address";
    }

    if (!password) {
      newErrors.password = "Please enter a password";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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

    const result = await register(firstName, lastName, email, password);

    if (result.success) {
      router.push("/account");
    } else {
      setApiError(result.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof RegisterErrors, value: string) => {
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white flex items-center justify-center px-3 md:px-6 pt-20 pb-16">
        <div className="w-full max-w-[500px]">
          <div>
            <h1
              className="text-center mb-10"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontWeight: 300,
              }}
            >
              Register
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

              {/* First Name */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                  className="w-full px-4 py-3 border-0 text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    backgroundColor: "#F2F2F2",
                  }}
                />
                {errors.firstName && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                  className="w-full px-4 py-3 border-0 text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    backgroundColor: "#F2F2F2",
                  }}
                />
                {errors.lastName && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                  >
                    {errors.lastName}
                  </p>
                )}
              </div>

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
              <div className="mb-6">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#222222] text-white py-4 font-bold text-sm uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Loading..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#DDD]" />
              <span
                className="text-xs uppercase"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  color: "#999",
                }}
              >
                or
              </span>
              <div className="flex-1 h-px bg-[#DDD]" />
            </div>

            {/* Google Sign-Up */}
            <GoogleSignInButton
              text="signup_with"
              onError={(msg) => setApiError(msg)}
            />

            <p
              className="text-center mt-6 text-sm"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#222222",
              }}
            >
              Already have a WTU account?{" "}
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
