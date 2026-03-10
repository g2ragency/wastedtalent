"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WooCommerceProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";

interface ProductDetailProps {
  product: WooCommerceProduct;
  contactInfo?: ContactInfo;
}

export default function ProductDetail({
  product,
  contactInfo,
}: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem } = useCart();

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      image: product.images?.[0]?.src,
    });
  };

  return (
    <main className="min-h-screen bg-white pt-24">
      <div className="w-full px-3 md:px-6">
        <div className="flex gap-12">
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
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm font-bold border transition-colors ${
                        selectedSize === size
                          ? "bg-[#222222] text-white border-[#222222]"
                          : "bg-white text-[#222222] border-gray-300 hover:border-[#222222]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
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
      </div>
      <Footer contactInfo={contactInfo} />
    </main>
  );
}
