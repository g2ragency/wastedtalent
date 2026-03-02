"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface AccountContentProps {
  contactInfo?: ContactInfo;
}

type AccountSection = "account" | "orders" | "delivery" | "billing";

const menuItems: { key: AccountSection; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "orders", label: "My Orders" },
  { key: "delivery", label: "Delivery Address" },
  { key: "billing", label: "Billing Address" },
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

export default function AccountContent({ contactInfo }: AccountContentProps) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>("account");

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
        <main className="min-h-screen bg-white pt-32 pb-16">
          <div className="max-w-[1440px] mx-auto px-6">
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
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex gap-12">
            {/* Left Sidebar */}
            <div className="w-[325px] flex-shrink-0">
              <nav className="flex flex-col">
                {menuItems.map((item, index) => {
                  const isActive = activeSection === item.key;
                  const borderColor = isActive ? "#222222" : "#DDD";
                  const arrowColor = isActive ? "#222222" : "#DDD";

                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
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
                      }}
                    >
                      {item.label}
                      <ChevronRight color={arrowColor} />
                    </button>
                  );
                })}

                {/* Log Out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left uppercase transition-opacity hover:opacity-60 mt-4"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#222222",
                    padding: "24px 14px",
                  }}
                >
                  Log Out
                  <ChevronRight color="#222222" />
                </button>
              </nav>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              {activeSection === "account" && <AccountDetails user={user!} />}
              {activeSection === "orders" && <MyOrders />}
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
      className="w-full"
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
        <div className="bg-white" style={{ padding: "20px" }}>
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
        <div className="bg-white" style={{ padding: "20px" }}>
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
        <div className="bg-white" style={{ padding: "20px" }}>
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
        <div className="bg-white" style={{ padding: "20px" }}>
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
function MyOrders() {
  return (
    <div
      className="w-full"
      style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
    >
      <p
        className="text-sm"
        style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#666666" }}
      >
        You have no orders yet.
      </p>
    </div>
  );
}

function DeliveryAddress() {
  return (
    <div
      className="w-full"
      style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
    >
      <p
        className="text-sm"
        style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#666666" }}
      >
        No delivery address saved yet.
      </p>
    </div>
  );
}

function BillingAddress() {
  return (
    <div
      className="w-full"
      style={{ backgroundColor: "#F2F2F2", padding: "105px 55px" }}
    >
      <p
        className="text-sm"
        style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#666666" }}
      >
        No billing address saved yet.
      </p>
    </div>
  );
}
