"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [currency, setCurrency] = useState("€ EUR (IT)");

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">
        {/* Left Menu */}
        <nav className="flex flex-1 items-center gap-8">
          <Link
            href="/shop"
            className="text-sm font-medium uppercase tracking-wider text-black transition-opacity hover:opacity-60"
          >
            SHOP
          </Link>
          <Link
            href="/lookbook"
            className="text-sm font-medium uppercase tracking-wider text-black transition-opacity hover:opacity-60"
          >
            LOOKBOOK
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium uppercase tracking-wider text-black transition-opacity hover:opacity-60"
          >
            ABOUT
          </Link>
        </nav>

        {/* Center Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <img
              src="/logo.png"
              alt="Wasted Talent United"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Right Menu */}
        <nav className="flex flex-1 items-center justify-end gap-8">
          <button
            className="flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-black transition-opacity hover:opacity-60"
            onClick={() => {
              // Toggle currency logic here
              setCurrency(currency === "€ EUR (IT)" ? "$ USD" : "€ EUR (IT)");
            }}
          >
            {currency}
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <Link
            href="/account"
            className="text-sm font-medium uppercase tracking-wider text-black transition-opacity hover:opacity-60"
          >
            LOGIN
          </Link>
          <Link
            href="/cart"
            className="text-sm font-medium uppercase tracking-wider text-black transition-opacity hover:opacity-60"
          >
            CART
          </Link>
        </nav>
      </div>
    </header>
  );
}
