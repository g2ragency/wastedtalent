"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { WooCommerceProduct, ProductVariation } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";

interface ProductDetailProps {
  product: WooCommerceProduct;
  contactInfo?: ContactInfo;
}

const FREE_SHIPPING_THRESHOLD = 174;

export default function ProductDetail({
  product,
  contactInfo,
}: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeSheetOpen, setSizeSheetOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const { addItem, items, totalItems, totalPrice } = useCart();
  const sizeSheetRef = useRef<HTMLDivElement>(null);
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const [stickyBarHeight, setStickyBarHeight] = useState(0);

  // Fetch variations when component mounts
  useEffect(() => {
    if (product.type === "variable" && product.id) {
      setLoadingVariations(true);
      fetch(`/api/products/${product.id}/variations`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setVariations(data);
          }
        })
        .catch((err) => console.error("Error fetching variations:", err))
        .finally(() => setLoadingVariations(false));
    }
  }, [product.id, product.type]);

  // Lock body scroll when sheets are open (mobile only)
  useEffect(() => {
    if (sizeSheetOpen || cartSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sizeSheetOpen, cartSheetOpen]);

  // Measure sticky bar height for size sheet positioning
  useEffect(() => {
    const measureBar = () => {
      if (stickyBarRef.current) {
        setStickyBarHeight(stickyBarRef.current.offsetHeight);
      }
    };
    measureBar();
    window.addEventListener("resize", measureBar);
    return () => window.removeEventListener("resize", measureBar);
  }, []);
  const getSizes = () => {
    if (variations.length > 0) {
      return variations.map((v) => {
        const sizeAttr = v.attributes.find(
          (a) =>
            a.name.toLowerCase() === "size" ||
            a.name.toLowerCase() === "taglia",
        );
        return {
          name: sizeAttr?.option || "",
          stockQuantity: v.stock_quantity,
          stockStatus: v.stock_status,
          variationId: v.id,
        };
      });
    }

    // Fallback: use product attributes
    const sizeAttr = product.attributes?.find(
      (a) =>
        a.name.toLowerCase() === "size" || a.name.toLowerCase() === "taglia",
    );
    if (sizeAttr) {
      return sizeAttr.options.map((opt) => ({
        name: opt,
        stockQuantity: null as number | null,
        stockStatus: "instock",
        variationId: 0,
      }));
    }

    // Ultimate fallback
    return ["Small", "Medium", "Large", "Xlarge"].map((s) => ({
      name: s,
      stockQuantity: null as number | null,
      stockStatus: "instock",
      variationId: 0,
    }));
  };

  const sizes = getSizes();

  const getStockLabel = (size: {
    stockQuantity: number | null;
    stockStatus: string;
  }) => {
    if (size.stockStatus === "outofstock") return "Sold out";
    if (
      size.stockQuantity !== null &&
      size.stockQuantity > 0 &&
      size.stockQuantity < 20
    )
      return "Only a few left";
    return "";
  };

  const isSoldOut = (size: { stockStatus: string }) => {
    return size.stockStatus === "outofstock";
  };

  const handleSelectSize = (sizeName: string, soldOut: boolean) => {
    if (soldOut) return;
    setSelectedSize(sizeName);
    setSizeSheetOpen(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        image: product.images?.[0]?.src,
      },
      true, // suppress default drawer on mobile
    );
    // Show cart sheet instead of default drawer
    setCartSheetOpen(true);
  };

  const handleSizeButtonClick = () => {
    setCartSheetOpen(false);
    setSizeSheetOpen(!sizeSheetOpen);
  };

  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  return (
    <main className="min-h-screen bg-white pt-24">
      <div className="w-full px-3 md:px-6">
        {/* Desktop: Side by side layout */}
        <div className="hidden md:flex gap-12">
          {/* Left: Scrollable Images */}
          <div className="w-1/2">
            <div>
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={image.id} className="bg-gray-100 w-full">
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      width={800}
                      height={1067}
                      className="w-full h-auto object-cover block"
                    />
                  </div>
                ))
              ) : (
                <div
                  className="bg-gray-100 flex items-center justify-center text-gray-400"
                  style={{ height: "600px" }}
                >
                  No image
                </div>
              )}
            </div>
          </div>

          {/* Right: Sticky Product Info */}
          <div className="w-1/2">
            <div className="sticky top-24">
              <h1
                className="font-bold mb-2"
                style={{
                  fontSize: "32px",
                  fontFamily: "Helvetica Neue, sans-serif",
                }}
              >
                {product.name}
              </h1>

              <p
                className="font-bold mb-8"
                style={{
                  fontSize: "24px",
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

              {/* Size Selector */}
              <div className="mb-8">
                <p className="text-sm font-bold mb-3 uppercase">Select size</p>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => {
                    const soldOut = isSoldOut(size);
                    return (
                      <button
                        key={size.name}
                        onClick={() => handleSelectSize(size.name, soldOut)}
                        disabled={soldOut}
                        className={`py-3 text-sm font-bold border transition-colors ${
                          soldOut
                            ? "bg-white text-gray-300 border-gray-200 cursor-not-allowed"
                            : selectedSize === size.name
                              ? "bg-[#222222] text-white border-[#222222]"
                              : "bg-white text-[#222222] border-gray-300 hover:border-[#222222]"
                        }`}
                      >
                        {size.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-4 font-bold text-sm uppercase mb-4 transition-all border border-[#222222] ${
                  !selectedSize
                    ? "bg-[#222222] text-white opacity-50 cursor-not-allowed"
                    : "bg-[#222222] text-white hover:bg-transparent hover:text-[#222222]"
                }`}
              >
                Add to cart
              </button>

              {/* Product Description */}
              {product.description && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-bold text-sm mb-3 uppercase">
                    Description
                  </h3>
                  <div
                    className="text-sm leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Stacked images */}
        <div className="md:hidden pb-40">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <div key={image.id} className="bg-gray-100 w-full mb-1">
                <Image
                  src={image.src}
                  alt={image.alt || `${product.name} ${index + 1}`}
                  width={800}
                  height={1067}
                  className="w-full h-auto object-cover block"
                />
              </div>
            ))
          ) : (
            <div
              className="bg-gray-100 flex items-center justify-center text-gray-400"
              style={{ height: "400px" }}
            >
              No image
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Overlay backdrop */}
      {(sizeSheetOpen || cartSheetOpen) && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[80]"
          onClick={() => {
            setSizeSheetOpen(false);
            setCartSheetOpen(false);
          }}
        />
      )}

      {/* Mobile: Sticky Bottom Bar - ALWAYS visible (name + price + buttons) */}
      <div
        ref={stickyBarRef}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          zIndex: cartSheetOpen ? 70 : 85,
          borderTop: sizeSheetOpen ? "1px solid #DDD" : "none",
        }}
      >
        <div className="px-3 pb-3" style={{ paddingTop: "30px" }}>
          {/* Product name & price */}
          <div className="mb-3">
            <h2
              className="font-bold"
              style={{
                fontSize: "22px",
                fontFamily: "Helvetica Neue, sans-serif",
                fontWeight: "bold",
                lineHeight: "1.2",
              }}
            >
              {product.name}
            </h2>
            <p
              className="font-bold"
              style={{
                fontSize: "22px",
                fontFamily: "Helvetica Neue, sans-serif",
                color: "#999999",
                marginTop: "2px",
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
          </div>

          {/* Select Size + Add to Cart row */}
          <div className="flex gap-3">
            <button
              onClick={handleSizeButtonClick}
              className="flex-1 flex items-center justify-between px-3 py-3 border border-[#222222] bg-white"
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              <span className="uppercase">{selectedSize || "Select size"}</span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                className={`transition-transform ${sizeSheetOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 1l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`flex-1 py-3 font-bold text-sm uppercase transition-all ${
                !selectedSize
                  ? "bg-[#222222] text-white opacity-40 cursor-not-allowed"
                  : "bg-[#222222] text-white"
              }`}
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "12px",
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Size Selector Bottom Sheet - slides up ABOVE the sticky bar */}
      <div
        ref={sizeSheetRef}
        className="md:hidden fixed left-0 right-0 bg-white z-[82]"
        style={{
          bottom: 0,
          maxHeight: "70vh",
          overflowY: "auto",
          transform: sizeSheetOpen ? `translateY(-${stickyBarHeight}px)` : "translateY(100%)",
          visibility: sizeSheetOpen ? "visible" : "hidden",
          transition: sizeSheetOpen
            ? "transform 300ms ease-out, visibility 0s"
            : "transform 300ms ease-out, visibility 0s 300ms",
        }}
      >
        {/* Select size header with grey background */}
        <div
          style={{
            backgroundColor: "#F2F2F2",
            padding: "20px 12px",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-bold text-sm"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Select size
            </h3>
            <button
              onClick={() => setSizeSheetOpen(false)}
              className="text-lg leading-none"
              style={{ color: "#222222" }}
            >
              ✕
            </button>
          </div>
        </div>
        <div>
          <div className="space-y-0">
            {sizes.map((size) => {
              const soldOut = isSoldOut(size);
              const stockLabel = getStockLabel(size);
              return (
                <button
                  key={size.name}
                  onClick={() => handleSelectSize(size.name, soldOut)}
                  disabled={soldOut}
                  className="w-full flex items-center justify-between py-[20px] px-3 border-b border-gray-100 last:border-b-0"
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{
                      color: soldOut ? "#CCCCCC" : "#222222",
                      fontWeight: soldOut ? "normal" : "bold",
                    }}
                  >
                    {size.name}
                  </span>
                  {stockLabel && (
                    <span
                      className="text-sm"
                      style={{
                        color: soldOut ? "#CCCCCC" : "#999999",
                      }}
                    >
                      {stockLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Cart Summary Bottom Sheet - replaces the sticky bar */}
      <div
        className="md:hidden fixed left-0 right-0 bottom-0 bg-white z-[90] transition-transform duration-300 ease-out"
        style={{
          transform: cartSheetOpen ? "translateY(0)" : "translateY(100%)",
          borderTop: cartSheetOpen ? "1px solid #DDD" : "none",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Shopping cart header with grey background */}
        <div
          style={{
            backgroundColor: "#F2F2F2",
            padding: "20px 12px",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-bold text-sm"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Shopping cart
            </h3>
            <button
              onClick={() => setCartSheetOpen(false)}
              className="text-lg leading-none"
              style={{ color: "#222222" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Subtotal + shipping + Checkout + Continue shopping */}
        <div style={{ padding: "30px 12px 12px" }}>
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              {totalPrice.toFixed(2).replace(".", ",")}€
            </span>
          </div>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "14px",
              fontWeight: "normal",
              color: "#999999",
              marginTop: "6px",
            }}
          >
            {amountToFreeShipping > 0
              ? `You are only €${amountToFreeShipping.toFixed(0)} away from free shipping`
              : "Free Shipping"}
          </p>
          <div style={{ marginTop: "16px" }}>
          <Link
            href="/checkout"
            className="block w-full py-3 text-center text-sm font-bold uppercase bg-[#222222] text-white mb-3"
            style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            onClick={() => setCartSheetOpen(false)}
          >
            Checkout
          </Link>
          <Link
            href="/shop"
            className="block w-full text-center text-sm hover:underline"
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              color: "#999999",
            }}
            onClick={() => setCartSheetOpen(false)}
          >
            Continue shopping
          </Link>
          </div>
        </div>
      </div>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
