"use client";

import { useEffect, useCallback } from "react";
import { WooCommerceProduct } from "@/lib/api";

// Define size groups with their labels and size options
const SIZE_GROUPS = [
  {
    label: "TOPS",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    label: "BOTTOMS",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"],
  },
  {
    label: "ACCESSORIES",
    sizes: ["7", "7 1/2", "7 1/4", "7 1/8", "7 3/4", "7 3/8", "7 5/8", "7 7/8", "OS"],
  },
];

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: WooCommerceProduct[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  showOnlyAvailable: boolean;
  onToggleAvailable: () => void;
  onReset: () => void;
  filteredCount: number;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  products,
  selectedSizes,
  onToggleSize,
  showOnlyAvailable,
  onToggleAvailable,
  onReset,
  filteredCount,
}: FilterDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Get all available sizes from products (for highlighting which sizes actually exist)
  const getAvailableSizes = useCallback(() => {
    const available = new Set<string>();
    products.forEach((product) => {
      if (product.attributes) {
        product.attributes.forEach((attr) => {
          if (
            attr.name.toLowerCase() === "size" ||
            attr.name.toLowerCase() === "taglia"
          ) {
            attr.options.forEach((opt) => available.add(normalizeSize(opt)));
          }
        });
      }
    });
    return available;
  }, [products]);

  const availableSizes = getAvailableSizes();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[998] ${
          isOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer - slides from LEFT */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[450px] bg-white z-[999] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2
            className="text-lg font-bold uppercase tracking-wide"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Filters
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity"
            aria-label="Close filters"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Size Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-base font-bold"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
              >
                Size
              </h3>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path d="M1 7l5-5 5 5" stroke="#222222" strokeWidth="1.5" />
              </svg>
            </div>

            {SIZE_GROUPS.map((group) => {
              // Only show the group if at least one size exists in products
              const groupHasProducts = group.sizes.some((s) =>
                availableSizes.has(s)
              );
              if (!groupHasProducts) return null;

              return (
                <div key={group.label} className="mb-8">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      color: "#222222",
                    }}
                  >
                    {group.label}
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {group.sizes.map((size) => {
                      const exists = availableSizes.has(size);
                      if (!exists) return null;
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => onToggleSize(size)}
                          className={`py-3 text-sm border transition-colors ${
                            isSelected
                              ? "bg-[#222222] text-white border-[#222222]"
                              : "bg-white text-[#222222] border-gray-300 hover:border-[#222222]"
                          }`}
                          style={{
                            fontFamily: "Helvetica Neue, sans-serif",
                            fontSize: "13px",
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show only available products toggle */}
          <div className="flex items-center justify-between py-6 border-t border-gray-200">
            <span
              className="text-sm"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#222222",
              }}
            >
              Show only available products
            </span>
            <button
              onClick={onToggleAvailable}
              className="relative w-[44px] h-[24px] rounded-full transition-colors duration-200"
              style={{
                backgroundColor: showOnlyAvailable ? "#222222" : "#DDDDDD",
              }}
              aria-label="Toggle show only available products"
            >
              <span
                className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white transition-transform duration-200 shadow-sm"
                style={{
                  left: "2px",
                  transform: showOnlyAvailable
                    ? "translateX(20px)"
                    : "translateX(0)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t px-6 py-5 flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-4 text-sm font-bold uppercase border border-[#222222] bg-white text-[#222222] hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-bold uppercase bg-[#222222] text-white border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
          >
            View Results
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Normalize a size string to a display format for comparison.
 * E.g. "small" -> "S", "x-large" -> "XL", "28" -> "28"
 */
function normalizeSize(raw: string): string {
  const lower = raw.toLowerCase().replace(/-/g, "").trim();
  const map: { [key: string]: string } = {
    xxsmall: "XXS",
    xsmall: "XS",
    small: "S",
    medium: "M",
    large: "L",
    xlarge: "XL",
    xxlarge: "XXL",
    xxxlarge: "XXXL",
    // Pass-through for numeric and fraction sizes
  };
  if (map[lower]) return map[lower];
  // Return original for numeric sizes like "28", "7 1/2", "OS"
  return raw.trim();
}
