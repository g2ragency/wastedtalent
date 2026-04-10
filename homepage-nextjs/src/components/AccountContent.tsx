"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";
import { useAuth, Address, Order } from "@/context/AuthContext";

interface AccountContentProps {
  contactInfo?: ContactInfo;
  section?: AccountSection;
}

type AccountSection = "account" | "orders" | "delivery" | "billing";

const menuItems: { key: AccountSection; label: string; href: string }[] = [
  { key: "account", label: "Account", href: "/account" },
  { key: "orders", label: "My Orders", href: "/account/orders" },
  { key: "delivery", label: "Delivery Address", href: "/account/delivery" },
  { key: "billing", label: "Billing Address", href: "/account/billing" },
];

/* ──────────────────────────────────────────────
   Edit Icon SVG (edit-wtu.svg)
   ────────────────────────────────────────────── */
function EditIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.75 10.9966V14.9966C18.75 17.758 16.5114 19.9966 13.75 19.9966H5.75C2.98858 19.9966 0.75 17.758 0.75 14.9966V6.99658C0.75 4.23516 2.98858 1.99658 5.75 1.99658H9.75"
        stroke="#222222"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.0463 4.87127L14.497 1.41528C15.2775 0.633644 16.5433 0.633165 17.3244 1.41421L18.9839 3.07371C19.7582 3.84809 19.7663 5.10174 19.0019 5.88601L11.5729 13.5082C11.0085 14.0873 10.2344 14.4138 9.42603 14.4138L7.15381 14.4137C6.51687 14.4137 6.00821 13.8827 6.035 13.2459L6.08412 12.0781L6.13324 10.9103C6.16483 10.1593 6.47697 9.44748 7.00789 8.91575L8.61431 7.3069"
        stroke="#222222"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.4282 5.60345L17.1143 7.28955"
        stroke="#222222"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Chevron Right SVG
   ────────────────────────────────────────────── */
function ChevronRight({ color = "#222222" }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" stroke={color} />
    </svg>
  );
}

export default function AccountContent({
  contactInfo,
  section = "account",
}: AccountContentProps) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const activeSection = section;

  // All hooks must be before any conditional returns
  const [isMobile, setIsMobile] = useState(false);
  const [mobileShowContent, setMobileShowContent] = useState(false);
  const orderGoBackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // On mobile, if we navigate to a sub-section via URL, show content
  useEffect(() => {
    if (activeSection !== "account") {
      setMobileShowContent(true);
    } else {
      setMobileShowContent(false);
    }
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
    return (
      <>
        <main
          className={`min-h-screen pt-24 md:pt-32 pb-16 ${isMobile && mobileShowContent ? "bg-[#F2F2F2]" : "bg-white"}`}
        >
          <div className="max-w-[1440px] mx-auto px-3 md:px-6">
            <p
              className="text-sm"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#222222",
              }}
            >
              Loading...
            </p>
          </div>
        </main>
        <Footer contactInfo={contactInfo} />
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media (max-width: 767px) {
          .account-details-wrapper {
            background-color: transparent !important;
            padding: 0 !important;
          }
          .account-field-card {
            background-color: white !important;
            padding: 30px 20px !important;
          }
          .account-inner-card {
            padding: 24px 16px 30px !important;
          }
          .account-order-card {
            padding: 44px 24px !important;
          }
          .account-order-card .order-row-gap {
            margin-bottom: 30px !important;
          }
          .account-order-card .order-edit-icon {
            margin-bottom: 8px !important;
          }
          .account-inner-card .order-detail-gap {
            margin-bottom: 30px !important;
          }
          .account-inner-card .order-detail-padding {
            padding: 24px 16px 30px !important;
          }
        }
      `}</style>
      <main
        className={`min-h-screen pt-24 md:pt-32 pb-16 ${isMobile && mobileShowContent ? "bg-[#F2F2F2]" : "bg-white"}`}
      >
        <div className="max-w-[1440px] mx-auto px-3 md:px-6">
          <div className="flex flex-col md:flex-row gap-0 md:gap-12">
            {/* Left Sidebar - always visible on desktop, on mobile only when no sub-section is active */}
            <div
              className={`w-full md:w-[325px] md:flex-shrink-0 ${isMobile && mobileShowContent ? "hidden" : ""}`}
            >
              <nav className="flex flex-col">
                {menuItems.map((item, index) => {
                  const isActive =
                    isMobile && !mobileShowContent
                      ? false
                      : activeSection === item.key;
                  const borderColor = isActive ? "#222222" : "#DDD";
                  const arrowColor = isActive ? "#222222" : "#DDD";

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={(e) => {
                        if (isMobile && item.key === "account") {
                          e.preventDefault();
                          setMobileShowContent(true);
                        }
                        // For other items, let the Link navigate normally.
                        // The useEffect on activeSection will set mobileShowContent.
                      }}
                      className="flex items-center justify-between w-full text-left uppercase transition-colors"
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#222222",
                        padding: "24px 14px",
                        border: `1px solid ${borderColor}`,
                        marginTop: index > 0 ? "-1px" : "0",
                        backgroundColor: "transparent",
                        position: "relative" as const,
                        zIndex: isActive ? 1 : 0,
                        textDecoration: "none",
                      }}
                    >
                      {item.label}
                      <ChevronRight color={arrowColor} />
                    </Link>
                  );
                })}

                {/* Log Out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left uppercase transition-opacity hover:opacity-60"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#222222",
                    padding: "24px 14px",
                    paddingLeft: isMobile ? "0" : "14px",
                    marginTop: "34px",
                  }}
                >
                  Log Out
                  <ChevronRight color="#222222" />
                </button>
              </nav>
            </div>

            {/* Right Content - always visible on desktop, on mobile only when a sub-section is active */}
            <div
              className={`flex-1 ${isMobile && !mobileShowContent ? "hidden" : ""}`}
            >
              {/* Mobile back button */}
              {isMobile && mobileShowContent && (
                <button
                  onClick={() => {
                    if (orderGoBackRef.current) {
                      orderGoBackRef.current();
                      return;
                    }
                    setMobileShowContent(false);
                    router.push("/account");
                  }}
                  className="flex items-center gap-2 mb-4 hover:opacity-60 transition-opacity"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#222222",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#222222"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" stroke="#222222" />
                  </svg>
                  Back
                </button>
              )}
              {activeSection === "account" && <AccountDetails user={user!} />}
              {activeSection === "orders" && <MyOrders orderGoBackRef={orderGoBackRef} />}
              {activeSection === "delivery" && <DeliveryAddress />}
              {activeSection === "billing" && <BillingAddress />}
            </div>
          </div>
        </div>
      </main>
      <Footer contactInfo={contactInfo} />
    </>
  );
}

/* ──────────────────────────────────────────────
   Account Details Section
   ────────────────────────────────────────────── */
function AccountDetails({
  user,
}: {
  user: { id: number; email: string; firstName: string; lastName: string };
}) {
  const { updateProfile, changePassword } = useAuth();

  // Edit states
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Field values
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const handleSaveName = async () => {
    clearFeedback();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please fill in both first name and last name");
      return;
    }
    setSaving(true);
    const result = await updateProfile(
      firstName.trim(),
      lastName.trim(),
      email,
    );
    setSaving(false);
    if (result.success) {
      setSuccess("Name updated successfully");
      setEditingName(false);
    } else {
      setError(result.message || "Failed to update name");
    }
  };

  const handleSaveEmail = async () => {
    clearFeedback();
    if (!email.trim()) {
      setError("Please enter your e-mail address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid e-mail address");
      return;
    }
    setSaving(true);
    const result = await updateProfile(firstName, lastName, email.trim());
    setSaving(false);
    if (result.success) {
      setSuccess("Email updated successfully");
      setEditingEmail(false);
    } else {
      setError(result.message || "Failed to update email");
    }
  };

  const validatePasswordComplexity = (pw: string): string | null => {
    if (pw.length < 8 || pw.length > 20) {
      return "Password must be between 8 and 20 characters";
    }
    if (!/[A-Z]/.test(pw)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[^a-zA-Z0-9]/.test(pw)) {
      return "Password must contain at least one symbol";
    }
    return null;
  };

  const handleSavePassword = async () => {
    clearFeedback();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }

    const complexityError = validatePasswordComplexity(newPassword);
    if (complexityError) {
      setError(complexityError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);
    const result = await changePassword(
      currentPassword,
      newPassword,
      confirmPassword,
    );
    setSaving(false);
    if (result.success) {
      setSuccess("Password changed successfully");
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(result.message || "Failed to change password");
    }
  };

  const handleCancelName = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEditingName(false);
    clearFeedback();
  };

  const handleCancelEmail = () => {
    setEmail(user.email || "");
    setEditingEmail(false);
    clearFeedback();
  };

  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEditingPassword(false);
    clearFeedback();
  };

  return (
    <div
      className="w-full account-details-wrapper"
      style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
    >
      {/* Feedback messages */}
      {error && (
        <div
          className="mb-6 px-4 py-3"
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FECACA",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "#DC2626",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="mb-6 px-4 py-3"
          style={{
            backgroundColor: "#D1FAE5",
            border: "1px solid #A7F3D0",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "#059669",
          }}
        >
          {success}
        </div>
      )}

      {/* Row 1: First Name + Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* First Name */}
        <div
          className="bg-white account-field-card"
          style={{ padding: "20px" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p
                className="uppercase mb-1"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  color: "#999999",
                  letterSpacing: "0.5px",
                }}
              >
                First Name
              </p>
              {editingName ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#222222",
                    backgroundColor: "transparent",
                  }}
                />
              ) : (
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#222222",
                  }}
                >
                  {user.firstName || "\u2014"}
                </p>
              )}
            </div>
            {!editingName && (
              <button
                onClick={() => {
                  clearFeedback();
                  setEditingName(true);
                }}
                className="ml-3 mt-1 hover:opacity-60 transition-opacity"
                aria-label="Edit First Name"
              >
                <EditIcon />
              </button>
            )}
          </div>
        </div>

        {/* Last Name */}
        <div
          className="bg-white account-field-card"
          style={{ padding: "20px" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p
                className="uppercase mb-1"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  color: "#999999",
                  letterSpacing: "0.5px",
                }}
              >
                Last Name
              </p>
              {editingName ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#222222",
                    backgroundColor: "transparent",
                  }}
                />
              ) : (
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#222222",
                  }}
                >
                  {user.lastName || "\u2014"}
                </p>
              )}
            </div>
            {!editingName && (
              <button
                onClick={() => {
                  clearFeedback();
                  setEditingName(true);
                }}
                className="ml-3 mt-1 hover:opacity-60 transition-opacity"
                aria-label="Edit Last Name"
              >
                <EditIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save/Cancel for Name */}
      {editingName && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSaveName}
            disabled={saving}
            className="bg-[#222222] text-white py-3 px-8 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:opacity-50"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancelName}
            className="py-3 px-8 text-sm font-bold uppercase border border-[#DDD] hover:border-[#222222] transition-all"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              color: "#222222",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Row 2: Email (full width) */}
      <div className="mb-6">
        <div
          className="bg-white account-field-card"
          style={{ padding: "20px" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p
                className="uppercase mb-1"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  color: "#999999",
                  letterSpacing: "0.5px",
                }}
              >
                Email
              </p>
              {editingEmail ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#222222",
                    backgroundColor: "transparent",
                  }}
                />
              ) : (
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#222222",
                  }}
                >
                  {user.email || "\u2014"}
                </p>
              )}
            </div>
            {!editingEmail && (
              <button
                onClick={() => {
                  clearFeedback();
                  setEditingEmail(true);
                }}
                className="ml-3 mt-1 hover:opacity-60 transition-opacity"
                aria-label="Edit Email"
              >
                <EditIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save/Cancel for Email */}
      {editingEmail && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSaveEmail}
            disabled={saving}
            className="bg-[#222222] text-white py-3 px-8 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:opacity-50"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancelEmail}
            className="py-3 px-8 text-sm font-bold uppercase border border-[#DDD] hover:border-[#222222] transition-all"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              color: "#222222",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Row 3: Password (full width) */}
      <div className="mb-6">
        <div
          className="bg-white account-field-card"
          style={{ padding: "20px" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p
                className="uppercase mb-1"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  color: "#999999",
                  letterSpacing: "0.5px",
                }}
              >
                Password
              </p>
              {!editingPassword && (
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#222222",
                  }}
                >
                  ••••••••••••••
                </p>
              )}
            </div>
            {!editingPassword && (
              <button
                onClick={() => {
                  clearFeedback();
                  setEditingPassword(true);
                }}
                className="ml-3 mt-1 hover:opacity-60 transition-opacity"
                aria-label="Change Password"
              >
                <EditIcon />
              </button>
            )}
          </div>

          {/* Password change form */}
          {editingPassword && (
            <div className="mt-4 space-y-4">
              {/* Current Password */}
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-0 text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    backgroundColor: "#F2F2F2",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#222222] transition-colors"
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                >
                  <PasswordToggleIcon show={showCurrentPassword} />
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-0 text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    backgroundColor: "#F2F2F2",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#222222] transition-colors"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  <PasswordToggleIcon show={showNewPassword} />
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-0 text-sm focus:outline-none transition-colors"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    backgroundColor: "#F2F2F2",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#222222] transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <PasswordToggleIcon show={showConfirmPassword} />
                </button>
              </div>

              {/* Password rules hint */}
              <p
                className="text-xs"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  color: "#999999",
                }}
              >
                8-20 characters, at least one uppercase letter and one symbol.
                Must not match your last 5 passwords.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save/Cancel for Password */}
      {editingPassword && (
        <div className="flex gap-3">
          <button
            onClick={handleSavePassword}
            disabled={saving}
            className="bg-[#222222] text-white py-3 px-8 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:opacity-50"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancelPassword}
            className="py-3 px-8 text-sm font-bold uppercase border border-[#DDD] hover:border-[#222222] transition-all"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              color: "#222222",
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Password Toggle Icon
   ────────────────────────────────────────────── */
function PasswordToggleIcon({ show }: { show: boolean }) {
  return show ? (
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
  );
}

/* ──────────────────────────────────────────────
   Placeholder sections (to be implemented)
   ────────────────────────────────────────────── */
function MyOrders({ orderGoBackRef }: { orderGoBackRef: React.MutableRefObject<(() => void) | null> }) {
  const { getOrders } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Register/unregister the back callback for the global Back button
  useEffect(() => {
    if (selectedOrder) {
      orderGoBackRef.current = () => setSelectedOrder(null);
    } else {
      orderGoBackRef.current = null;
    }
    return () => { orderGoBackRef.current = null; };
  }, [selectedOrder, orderGoBackRef]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const result = await getOrders();
    if (result.success && result.data) {
      setOrders(result.data);
    } else {
      setError(result.message || "Failed to load orders");
    }
    setLoading(false);
  }, [getOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTotal = (total: string, symbol: string) => {
    const num = parseFloat(total);
    const formatted = num.toFixed(2).replace(".", ",");
    // Decode HTML entities like &euro; → €
    const decoded = symbol
      .replace(/&euro;/g, "€")
      .replace(/&pound;/g, "£")
      .replace(/&dollar;/g, "$")
      .replace(/&#36;/g, "$");
    return `${formatted}${decoded}`;
  };

  // Label style
  const labelStyle = {
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: "12px",
    color: "#999999",
    letterSpacing: "0.5px",
  };

  // Value style
  const valueStyle = {
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: "18px",
    fontWeight: 700 as const,
    color: "#222222",
  };

  if (loading) {
    return (
      <div
        className="w-full account-details-wrapper"
        style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            color: "#666666",
          }}
        >
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full account-details-wrapper"
        style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            color: "#DC2626",
          }}
        >
          {error}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="w-full account-details-wrapper"
        style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            color: "#666666",
          }}
        >
          You have no orders yet.
        </p>
      </div>
    );
  }

  // ── Order Detail View ──
  if (selectedOrder) {
    return (
      <div
        className="w-full account-details-wrapper"
        style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
      >
        {/* Back button - desktop only (mobile uses the global Back) */}
        <button
          onClick={() => setSelectedOrder(null)}
          className="hidden md:flex items-center gap-2 mb-8 hover:opacity-60 transition-opacity"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: "#222222",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222222"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" stroke="#222222" />
          </svg>
          Back to Orders
        </button>

        <div
          className="bg-white account-inner-card"
          style={{ padding: "40px 40px 60px" }}
        >
          {/* Order header info */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 order-detail-gap"
            style={{ marginBottom: "60px" }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Order
                </p>
                <p style={valueStyle}>#{selectedOrder.number}</p>
              </div>
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Products
                </p>
                <p style={valueStyle}>{selectedOrder.itemCount}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Date
                </p>
                <p style={valueStyle}>
                  {formatDate(selectedOrder.dateCreated)}
                </p>
              </div>
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Total
                </p>
                <p style={valueStyle}>
                  {formatTotal(
                    selectedOrder.total,
                    selectedOrder.currencySymbol,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Status & Payment */}
          <div
            className="grid grid-cols-2 gap-6 order-detail-gap"
            style={{ marginBottom: "60px" }}
          >
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Status
              </p>
              <p style={valueStyle}>{selectedOrder.statusLabel}</p>
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Payment
              </p>
              <p style={valueStyle}>{selectedOrder.paymentMethod || "—"}</p>
            </div>
          </div>

          {/* Order items */}
          <div>
            <p
              className="uppercase mb-4"
              style={{
                ...labelStyle,
                fontSize: "14px",
                fontWeight: 700,
                color: "#222222",
              }}
            >
              Items
            </p>
            <div className="flex flex-col">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-4"
                  style={{
                    borderTop: "1px solid #F2F2F2",
                    borderBottom:
                      idx === selectedOrder.items.length - 1
                        ? "1px solid #F2F2F2"
                        : "none",
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "90px",
                        height: "112px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <p
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#222222",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "12px",
                        color: "#999999",
                        marginTop: "4px",
                      }}
                    >
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#222222",
                    }}
                  >
                    {formatTotal(item.total, selectedOrder.currencySymbol)}
                  </p>
                </div>
              ))}

              {/* Shipping row */}
              {parseFloat(selectedOrder.shippingTotal) > 0 && (
                <div
                  className="flex items-center justify-between py-4"
                  style={{ borderTop: "1px solid #F2F2F2" }}
                >
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#222222",
                    }}
                  >
                    Shipping
                  </p>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#222222",
                    }}
                  >
                    {formatTotal(
                      selectedOrder.shippingTotal,
                      selectedOrder.currencySymbol,
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Orders Grid View ──
  return (
    <div
      className="w-full account-details-wrapper"
      style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white cursor-pointer hover:shadow-md transition-shadow account-order-card"
            style={{ padding: "40px 40px 60px" }}
            onClick={() => setSelectedOrder(order)}
          >
            {/* Edit icon */}
            <div className="flex justify-end mb-4 order-edit-icon">
              <div className="hover:opacity-60 transition-opacity">
                <EditIcon />
              </div>
            </div>

            {/* Row 1: Order number, Products count */}
            <div
              className="grid grid-cols-2 gap-6 order-row-gap"
              style={{ marginBottom: "60px" }}
            >
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Order
                </p>
                <p style={valueStyle}>{order.number}</p>
              </div>
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Products
                </p>
                <p style={valueStyle}>{order.itemCount}</p>
              </div>
            </div>

            {/* Row 2: Date, Total */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Date
                </p>
                <p style={valueStyle}>{formatDate(order.dateCreated)}</p>
              </div>
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Total
                </p>
                <p style={valueStyle}>
                  {formatTotal(order.total, order.currencySymbol)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryAddress() {
  return <AddressSection type="shipping" title="Delivery Address" />;
}

function BillingAddress() {
  return <AddressSection type="billing" title="Billing Address" />;
}

/* ──────────────────────────────────────────────
   Shared Address Section Component
   ────────────────────────────────────────────── */
function AddressSection({
  type,
  title,
}: {
  type: "shipping" | "billing";
  title: string;
}) {
  const { getAddress, updateAddress } = useAuth();

  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const loadAddress = useCallback(async () => {
    setLoading(true);
    const result = await getAddress(type);
    if (result.success && result.data) {
      setAddress(result.data);
    }
    setLoading(false);
  }, [getAddress, type]);

  useEffect(() => {
    loadAddress();
  }, [loadAddress]);

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const populateEditFields = () => {
    if (address) {
      setFirstName(address.firstName || "");
      setLastName(address.lastName || "");
      setCompany(address.company || "");
      setAddress1(address.address1 || "");
      setAddress2(address.address2 || "");
      setCity(address.city || "");
      setState(address.state || "");
      setPostcode(address.postcode || "");
      setCountry(address.country || "");
      setPhone(address.phone || "");
      if (type === "billing") {
        setEmail(address.email || "");
      }
    }
  };

  const handleEdit = () => {
    clearFeedback();
    populateEditFields();
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    clearFeedback();
  };

  const handleSave = async () => {
    setSaving(true);
    clearFeedback();

    const addressData: Partial<Address> = {
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      state,
      postcode,
      country,
      phone,
    };

    if (type === "billing") {
      addressData.email = email;
    }

    const result = await updateAddress(type, addressData);

    if (result.success && result.data) {
      setAddress(result.data);
      setEditing(false);
      setSuccess("Address updated successfully");
    } else {
      setError(result.message || "Failed to update address");
    }

    setSaving(false);
  };

  const hasAddress =
    address &&
    (address.firstName ||
      address.lastName ||
      address.address1 ||
      address.city ||
      address.postcode);

  // Label style
  const labelStyle = {
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: "12px",
    color: "#999999",
    letterSpacing: "0.5px",
  };

  // Value style
  const valueStyle = {
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: "18px",
    fontWeight: 700 as const,
    color: "#222222",
  };

  // Input style
  const inputStyle = {
    fontFamily: "Helvetica Neue, sans-serif",
    fontSize: "18px",
    fontWeight: 700 as const,
    color: "#222222",
    backgroundColor: "transparent",
  };

  if (loading) {
    return (
      <div
        className="w-full account-details-wrapper"
        style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
      >
        <p
          className="text-sm"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            color: "#666666",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full account-details-wrapper"
      style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
    >
      {error && (
        <div
          className="mb-6 px-4 py-3"
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FCA5A5",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "#DC2626",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="mb-6 px-4 py-3"
          style={{
            backgroundColor: "#D1FAE5",
            border: "1px solid #A7F3D0",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "#059669",
          }}
        >
          {success}
        </div>
      )}

      {!editing && !hasAddress && (
        <div
          className="flex flex-col items-center justify-center"
          style={{ minHeight: "120px" }}
        >
          <p
            className="text-sm mb-6"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              color: "#666666",
            }}
          >
            No {title.toLowerCase()} saved yet.
          </p>
          <button
            onClick={handleEdit}
            className="bg-[#222222] text-white py-3 px-8 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Add Address
          </button>
        </div>
      )}

      {!editing && hasAddress && (
        <div
          className="bg-white account-inner-card"
          style={{ padding: "40px 40px 60px" }}
        >
          {/* Edit button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleEdit}
              className="hover:opacity-60 transition-opacity"
              aria-label={`Edit ${title}`}
            >
              <EditIcon />
            </button>
          </div>

          {/* Row 1: Name, Zip Code, Note/Company */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ marginBottom: "60px" }}
          >
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Name
              </p>
              <p style={valueStyle}>
                {[address!.firstName, address!.lastName]
                  .filter(Boolean)
                  .join(" ") || "\u2014"}
              </p>
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Zip Code
              </p>
              <p style={valueStyle}>{address!.postcode || "\u2014"}</p>
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Note
              </p>
              <p style={valueStyle}>{address!.company || "\u2014"}</p>
            </div>
          </div>

          {/* Row 2: Address, City/Country, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Address
              </p>
              <p style={valueStyle}>
                {[address!.address1, address!.address2]
                  .filter(Boolean)
                  .join(", ") || "\u2014"}
              </p>
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                City, Country
              </p>
              <p style={valueStyle}>
                {[address!.city, address!.countryName || address!.country]
                  .filter(Boolean)
                  .join(", ") || "\u2014"}
              </p>
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Phone
              </p>
              <p style={valueStyle}>{address!.phone || "\u2014"}</p>
            </div>
          </div>

          {/* Row 3: Email (billing only) */}
          {type === "billing" && (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              style={{ marginTop: "60px" }}
            >
              <div>
                <p className="uppercase mb-1" style={labelStyle}>
                  Email
                </p>
                <p style={valueStyle}>{address!.email || "\u2014"}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Form */}
      {editing && (
        <div
          className="bg-white account-inner-card"
          style={{ padding: "40px 40px 60px" }}
        >
          {/* Row 1: First Name, Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                First Name
              </p>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Last Name
              </p>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 2: Address */}
          <div className="mb-6">
            <p className="uppercase mb-1" style={labelStyle}>
              Address Line 1
            </p>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
              style={inputStyle}
            />
          </div>

          {/* Row 3: Address 2 */}
          <div className="mb-6">
            <p className="uppercase mb-1" style={labelStyle}>
              Address Line 2
            </p>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
              style={inputStyle}
            />
          </div>

          {/* Row 4: City, Postcode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                City
              </p>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Zip Code
              </p>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 5: State, Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                State / Province
              </p>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Country
              </p>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. IT, US, GB"
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 6: Phone, Company/Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Phone
              </p>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
            <div>
              <p className="uppercase mb-1" style={labelStyle}>
                Note / Company
              </p>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 7: Email (billing only) */}
          {type === "billing" && (
            <div className="mb-6">
              <p className="uppercase mb-1" style={labelStyle}>
                Email
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 border-b border-[#DDD] pb-1 focus:outline-none focus:border-[#222222] transition-colors"
                style={inputStyle}
              />
            </div>
          )}

          {/* Save / Cancel */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#222222] text-white py-3 px-8 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:opacity-50"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="py-3 px-8 text-sm font-bold uppercase border border-[#DDD] hover:border-[#222222] transition-all"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#222222",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
