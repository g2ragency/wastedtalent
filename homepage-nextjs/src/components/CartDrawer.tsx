"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "http://wasted-talent.local/wp-json/site-manager/v1";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    isDrawerOpen,
    closeDrawer,
  } = useCart();

  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(0);
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(false);

  // Fetch free shipping threshold from WooCommerce
  useEffect(() => {
    fetch(`${API_URL}/shipping-info`)
      .then((res) => res.json())
      .then((response) => {
        if (response?.data) {
          setFreeShippingEnabled(response.data.free_shipping_enabled);
          setFreeShippingThreshold(response.data.free_shipping_threshold);
        }
      })
      .catch((err) => console.error("Error fetching shipping info:", err));
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isDrawerOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const amountToFreeShipping = freeShippingThreshold - totalPrice;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[998] ${
          isDrawerOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white z-[999] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2
            className="text-lg font-bold uppercase tracking-wide"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Shopping Cart
          </h2>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity"
            aria-label="Close cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#222222"
              strokeWidth="2"
            >
              <line x1="2" y1="2" x2="18" y2="18" />
              <line x1="18" y1="2" x2="2" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 mb-6">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="inline-block bg-[#222222] text-white px-8 py-3 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Product Image */}
                  {item.image && (
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeDrawer}
                      className="relative w-[90px] h-[90px] bg-gray-100 flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-bold hover:opacity-60 transition-opacity block truncate"
                      style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                    >
                      {item.name}
                    </Link>

                    <p className="text-sm text-gray-500 mt-1">
                      €{parseFloat(item.price).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-10 h-8 border-t border-b border-gray-300 flex items-center justify-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-gray-500 underline hover:text-[#222222] mt-2 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-sm font-bold flex-shrink-0">
                    €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - only show when items exist */}
        {items.length > 0 && (
          <div className="border-t px-6 py-5">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold uppercase">
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span className="text-sm font-bold">
                €{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Free Shipping Message */}
            {freeShippingEnabled &&
              freeShippingThreshold > 0 &&
              (amountToFreeShipping > 0 ? (
                <p className="text-xs text-gray-500 mb-3">
                  You&apos;re only €{amountToFreeShipping.toFixed(2)} away from
                  free shipping!
                </p>
              ) : (
                <p className="text-xs text-green-600 font-bold mb-3">
                  ✓ You qualify for free shipping!
                </p>
              ))}

            {/* Taxes note */}
            <p className="text-xs text-gray-400 mb-4">
              Taxes, discounts and shipping calculated at checkout
            </p>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full bg-[#222222] text-white py-4 font-bold text-sm uppercase text-center border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
            >
              Checkout
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeDrawer}
              className="block w-full text-center text-sm text-gray-500 hover:text-[#222222] mt-3 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
