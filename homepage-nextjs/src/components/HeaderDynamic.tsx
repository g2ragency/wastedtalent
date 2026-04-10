"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HeaderData } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  data: HeaderData;
}

// Funzione per convertire URL assoluti WordPress in path relativi
function getRelativePath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

export default function Header({ data }: HeaderProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const { user } = useAuth();
  const leftMenuItems = data.left_menu || [];
  const rightMenuItems = data.right_menu || [];

  // All menu items for mobile (left + right + extra links)
  const mobileMenuItems = [
    ...leftMenuItems,
    ...rightMenuItems,
    { id: 9999, title: "Contact", url: "/contact", target: "", classes: "" },
    {
      id: 9998,
      title: user ? "My Account" : "Login",
      url: user ? "/account" : "/login",
      target: "",
      classes: "",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const linkStyle = {
    fontSize: "14px",
    fontWeight: "bold" as const,
    lineHeight: "0.95",
    color: isHomepage && !mobileMenuOpen ? "white" : "#222222",
    letterSpacing: "-0.1px",
    mixBlendMode: (isHomepage && !mobileMenuOpen ? "difference" : "normal") as
      | "difference"
      | "normal",
  };

  return (
    <>
      <header
        className="fixed top-0 z-[70] w-full"
        style={{
          backgroundColor: mobileMenuOpen
            ? "#FFFFFF"
            : isHomepage
              ? scrolled
                ? "#FFFFFF"
                : "transparent"
              : "#FFFFFF",
          transition: isHomepage ? "background-color 0.3s" : "none",
        }}
      >
        <div className="flex items-center justify-between px-3 md:px-6 py-6">
          {/* Desktop: Left Menu */}
          <nav className="hidden md:flex flex-1 items-center gap-8">
            {leftMenuItems.map((item) => (
              <Link
                key={item.id}
                href={getRelativePath(item.url)}
                target={item.target || "_self"}
                className="uppercase transition-opacity hover:opacity-60"
                style={linkStyle}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile: MENU / CLOSE button */}
          <div className="flex md:hidden flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="uppercase transition-opacity hover:opacity-60"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#222222",
              }}
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              {/* Mobile logo: no blend/filter */}
              <img
                src="/logo.svg"
                alt="Wasted Talent United"
                className="block md:hidden h-[40px] w-[68px]"
              />
              {/* Desktop logo: blend + invert for homepage */}
              <img
                src="/logo.svg"
                alt="Wasted Talent United"
                className="hidden md:block h-12 w-auto"
                style={{
                  mixBlendMode: "difference",
                  filter: "invert(1)",
                }}
              />
            </Link>
          </div>

          {/* Desktop: Right Menu */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-8">
            {rightMenuItems.map((item) => (
              <Link
                key={item.id}
                href={getRelativePath(item.url)}
                target={item.target || "_self"}
                className="uppercase transition-opacity hover:opacity-60"
                style={linkStyle}
              >
                {item.title}
              </Link>
            ))}

            {/* Login / My Account */}
            <Link
              href={user ? "/account" : "/login"}
              className="uppercase transition-opacity hover:opacity-60"
              style={linkStyle}
            >
              {user ? "My Account" : "Login"}
            </Link>

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="uppercase transition-opacity hover:opacity-60"
              style={linkStyle}
            >
              Cart {totalItems > 0 && `(${totalItems})`}
            </button>
          </nav>

          {/* Mobile: Cart */}
          <div className="flex md:hidden flex-1 justify-end">
            <button
              onClick={openDrawer}
              className="uppercase transition-opacity hover:opacity-60"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#222222",
              }}
            >
              Cart ({totalItems})
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className="fixed inset-0 z-[60] md:hidden"
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: "80px",
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <div className="flex flex-col justify-between h-full px-3">
          {/* Menu Items */}
          <nav className="flex flex-col">
            <div style={{ borderTop: "1px solid #222222" }} />
            {mobileMenuItems.map((item) => (
              <Link
                key={item.id}
                href={getRelativePath(item.url)}
                target={item.target || "_self"}
                className="block transition-opacity hover:opacity-60"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "22px",
                  fontWeight: 400,
                  color: "#222222",
                  padding: "12px 0",
                  borderBottom: "1px solid #222222",
                  textDecoration: "none",
                  textTransform: "capitalize" as const,
                }}
              >
                {item.title.toLowerCase()}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div style={{ paddingBottom: "40px" }}>
            {/* Follow us */}
            <div
              className="flex items-start justify-between"
              style={{
                borderTop: "1px solid #222222",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            >
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#222222",
                }}
              >
                Follow us on:
              </p>
              <div className="flex flex-col items-end gap-1">
                <a
                  href="https://www.instagram.com/wasted_talent_united"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "12px",
                    color: "#222222",
                    fontWeight: 700,
                  }}
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* Policy links */}
            <div
              className="flex items-center justify-between"
              style={{
                borderTop: "1px solid #222222",
                paddingTop: "16px",
              }}
            >
              <Link
                href="/privacy"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  color: "#222222",
                  fontWeight: 700,
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/shipping"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  color: "#222222",
                  fontWeight: 700,
                }}
              >
                Shipping & Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
