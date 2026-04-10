"use client";

import { useEffect, useMemo } from "react";
import { WooCommerceProduct } from "@/lib/api";

/**
 * Map WooCommerce product category slugs to filter group labels.
 * Add new category slugs here as products are added.
 */
const CATEGORY_GROUP_MAP: { [slug: string]: string } = {
  // Tops
  hoodie: "TOPS",
  "t-shirt": "TOPS",
  tshirt: "TOPS",
  shirt: "TOPS",
  jacket: "TOPS",
  vest: "TOPS",
  sweater: "TOPS",
  sweatshirt: "TOPS",
  top: "TOPS",
  tops: "TOPS",
  felpa: "TOPS",
  maglietta: "TOPS",
  giacca: "TOPS",
  // Bottoms
  pants: "BOTTOMS",
  trousers: "BOTTOMS",
  shorts: "BOTTOMS",
  jeans: "BOTTOMS",
  pantaloni: "BOTTOMS",
  bottoms: "BOTTOMS",
  skirt: "BOTTOMS",
  // Accessories
  hat: "ACCESSORIES",
  hats: "ACCESSORIES",
  cap: "ACCESSORIES",
  caps: "ACCESSORIES",
  beanie: "ACCESSORIES",
  accessories: "ACCESSORIES",
  accessori: "ACCESSORIES",
  bag: "ACCESSORIES",
  bags: "ACCESSORIES",
  scarf: "ACCESSORIES",
};

/** Preferred display order for groups */
const GROUP_ORDER = ["TOPS", "BOTTOMS", "ACCESSORIES"];

/** Preferred sort order for standard alpha sizes */
const ALPHA_SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/**
 * Normalize a raw size option from WooCommerce to a short display label.
 * "small" → "S", "x-large" → "XL", "28" → "28", "7 1/2" → "7 1/2"
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
  };
  if (map[lower]) return map[lower];
  return raw.trim();
}

/** Sort sizes: alpha sizes in predefined order first, then numeric ascending */
function sortSizes(sizes: string[]): string[] {
  return sizes.sort((a, b) => {
    const aIdx = ALPHA_SIZE_ORDER.indexOf(a);
    const bIdx = ALPHA_SIZE_ORDER.indexOf(b);

    // Both are alpha sizes
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    // Only a is alpha
    if (aIdx !== -1) return -1;
    // Only b is alpha
    if (bIdx !== -1) return 1;

    // Try numeric comparison
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;

    // Fallback: string compare
    return a.localeCompare(b);
  });
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: WooCommerceProduct[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  selectedCategories: string[];
  onToggleCategory: (slug: string) => void;
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
  selectedCategories,
  onToggleCategory,
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

  /**
   * Build unique categories list from product data.
   * Skips "Uncategorized".
   */
  const categories = useMemo(() => {
    const catMap = new Map<string, { name: string; slug: string }>();
    products.forEach((product) => {
      if (product.categories) {
        product.categories.forEach((cat) => {
          if (
            cat.slug !== "uncategorized" &&
            cat.slug !== "non-categorizzato" &&
            !catMap.has(cat.slug)
          ) {
            catMap.set(cat.slug, { name: cat.name, slug: cat.slug });
          }
        });
      }
    });
    // Sort alphabetically by name
    return Array.from(catMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [products]);

  /**
   * Build size groups dynamically from product data.
   * Groups sizes by the category of the product they belong to.
   */
  const sizeGroups = useMemo(() => {
    const groups: { [groupLabel: string]: Set<string> } = {};

    products.forEach((product) => {
      // Determine which group this product belongs to based on its categories
      let groupLabel = "OTHER";
      if (product.categories && product.categories.length > 0) {
        for (const cat of product.categories) {
          const mapped = CATEGORY_GROUP_MAP[cat.slug.toLowerCase()];
          if (mapped) {
            groupLabel = mapped;
            break;
          }
        }
      }

      // Get sizes from product attributes
      if (product.attributes) {
        product.attributes.forEach((attr) => {
          if (
            attr.name.toLowerCase() === "size" ||
            attr.name.toLowerCase() === "taglia"
          ) {
            if (!groups[groupLabel]) groups[groupLabel] = new Set();
            attr.options.forEach((opt) => {
              groups[groupLabel].add(normalizeSize(String(opt)));
            });
          }
        });
      }
    });

    // Convert to sorted array and order by GROUP_ORDER
    const result: { label: string; sizes: string[] }[] = [];

    // Add groups in preferred order
    for (const label of GROUP_ORDER) {
      if (groups[label] && groups[label].size > 0) {
        result.push({
          label,
          sizes: sortSizes(Array.from(groups[label])),
        });
      }
    }

    // Add any remaining groups not in GROUP_ORDER
    for (const label of Object.keys(groups)) {
      if (!GROUP_ORDER.includes(label) && groups[label].size > 0) {
        result.push({
          label,
          sizes: sortSizes(Array.from(groups[label])),
        });
      }
    }

    return result;
  }, [products]);

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
          {/* Category Section */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-base font-bold"
                  style={{ fontFamily: "Helvetica Neue, sans-serif" }}
                >
                  Category
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

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => onToggleCategory(cat.slug)}
                      className={`px-4 py-3 text-sm border transition-colors ${
                        isSelected
                          ? "bg-[#222222] text-white border-[#222222]"
                          : "bg-white text-[#222222] border-gray-300 hover:border-[#222222]"
                      }`}
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Section */}
          {sizeGroups.length > 0 && (
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

              {sizeGroups.map((group) => (
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
              ))}
            </div>
          )}

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
