"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function OrderConfirmationContent() {
  useEffect(() => {
    // Clear cart from localStorage
    localStorage.removeItem("cart");
  }, []);

  return (
    <main className="min-h-screen bg-white pt-32 pb-16">
      <div className="w-full px-6">
        <div className="text-center py-20">
          <div className="mb-8">
            <svg
              className="w-20 h-20 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-light mb-4">
            Thank you for your order!
          </h1>
          <p className="text-gray-600 mb-8">
            Your order has been received and is being processed. You will
            receive a confirmation email shortly.
          </p>

          <div className="space-y-4">
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase hover:bg-gray-800 transition-colors"
            >
              Continue shopping
            </Link>

            <div>
              <Link href="/" className="text-sm hover:underline">
                Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
