"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { WooCommerceProduct } from "@/lib/api";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";
import FilterDrawer from "@/components/FilterDrawer";

interface ShopContentProps {
  products: WooCommerceProduct[];
  contactInfo?: ContactInfo;
}

/**
 * Normalize a size string from WooCommerce attributes to the short display format.
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
  };
  if (map[lower]) return map[lower];
  return raw.trim();
}

export default function ShopContent({
  products,
  contactInfo,
}: ShopContentProps) {
  const [scrolled, setScrolled] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  const handleToggleCategory = useCallback((slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const handleToggleAvailable = useCallback(() => {
    setShowOnlyAvailable((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedSizes([]);
    setSelectedCategories([]);
    setShowOnlyAvailable(false);
  }, []);

  // Filter products based on selected sizes and availability
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) => {
        if (!product.categories) return false;
        return product.categories.some((cat) =>
          selectedCategories.includes(cat.slug),
        );
      });
    }

    // Filter by selected sizes
    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        if (!product.attributes) return false;
        const sizeAttr = product.attributes.find(
          (a) =>
            a.name.toLowerCase() === "size" ||
            a.name.toLowerCase() === "taglia",
        );
        if (!sizeAttr) return false;
        return sizeAttr.options.some((opt) =>
          selectedSizes.includes(normalizeSize(opt)),
        );
      });
    }

    // Filter by availability
    if (showOnlyAvailable) {
      result = result.filter(
        (product) =>
          product.stock_status === "instock" || product.in_stock === true,
      );
    }

    return result;
  }, [products, selectedCategories, selectedSizes, showOnlyAvailable]);

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedCategories.length > 0 ||
    showOnlyAvailable;

  return (
    <main className="min-h-screen bg-white pt-24">
      <div className="w-full px-3 md:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-light mb-4">F/W 2026</h1>
        </div>
      </div>

      {/* Sticky Filters Bar - Full Width */}
      <div
        className={`flex items-center justify-between py-4 px-3 md:px-6 ${scrolled ? "shop-filters-sticky" : ""}`}
        style={{
          position: scrolled ? "fixed" : "static",
          left: "0",
          right: "0",
          width: "100%",
          backgroundColor: "#FFFFFF",
          zIndex: scrolled ? 40 : "auto",
          borderTop: "1px solid #DDDDDD",
          borderBottom: "1px solid #DDDDDD",
          color: "#999999",
        }}
      >
        <button
          className="text-sm flex items-center gap-2"
          style={{ color: hasActiveFilters ? "#222222" : "#999999" }}
          onClick={() => setFilterOpen(true)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-[#222222] text-white"
              style={{ fontSize: "10px", fontWeight: "bold" }}
            >
              {selectedSizes.length +
                selectedCategories.length +
                (showOnlyAvailable ? 1 : 0)}
            </span>
          )}
        </button>
        <p className="text-sm" style={{ color: "#999999" }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
        <button className="text-sm" style={{ color: "#999999" }}>
          Sort by
          <svg
            className="inline ml-1"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <div className="w-full px-3 md:px-6">
        {/* Spacer when filters are sticky */}
        {scrolled && <div style={{ height: "60px" }} />}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-[20px] mt-12">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group"
            >
              <div
                className="relative bg-gray-100 mb-3 overflow-hidden"
                style={{ aspectRatio: "65 / 81" }}
              >
                {product.images && product.images[0] ? (
                  <>
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      width={650}
                      height={810}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      style={{
                        opacity: 1,
                      }}
                    />
                    {product.images[1] && (
                      <Image
                        src={product.images[1].src}
                        alt={product.images[1].alt || product.name}
                        width={650}
                        height={810}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <h3
                className="font-bold mb-1"
                style={{
                  fontSize: "18px",
                  fontFamily: "Helvetica Neue, sans-serif",
                }}
              >
                {product.name}
              </h3>
              <p
                className="font-bold"
                style={{
                  fontSize: "18px",
                  fontFamily: "Helvetica Neue, sans-serif",
                  color: "#999999",
                }}
              >
                {product.price_html ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: product.price_html }}
                  />
                ) : (
                  `${product.price}€`
                )}
              </p>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No products match your filters</p>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-sm underline hover:text-[#222222] transition-colors"
                style={{ color: "#999999" }}
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        products={products}
        selectedSizes={selectedSizes}
        onToggleSize={handleToggleSize}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        showOnlyAvailable={showOnlyAvailable}
        onToggleAvailable={handleToggleAvailable}
        onReset={handleReset}
        filteredCount={filteredProducts.length}
      />

      <Footer contactInfo={contactInfo} />
      <style jsx global>{`
        .shop-filters-sticky {
          top: 88px;
        }
        @media (min-width: 768px) {
          .shop-filters-sticky {
            top: 96px;
          }
        }
      `}</style>
    </main>
  );
}
