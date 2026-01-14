"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WooCommerceProduct } from "@/lib/api";

interface ProductDetailProps {
  product: WooCommerceProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState("");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="w-full px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/shop" className="text-sm text-gray-500 hover:text-black">
            ← Back to shop
          </Link>
        </div>

        <div className="flex gap-12">
          {/* Left: Scrollable Images */}
          <div className="w-1/2">
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={image.id} className="bg-gray-100 w-full">
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      width={800}
                      height={1067}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="bg-gray-100 flex items-center justify-center text-gray-400" style={{ height: '600px' }}>
                  No image
                </div>
              )}
            </div>
          </div>

          {/* Right: Sticky Product Info */}
          <div className="w-1/2">
            <div className="sticky top-24">
            <h1 className="font-bold mb-2" style={{ fontSize: '32px', fontFamily: 'Helvetica Neue, sans-serif' }}>
              {product.name}
            </h1>
            
            <p className="font-bold mb-8" style={{ fontSize: '24px', fontFamily: 'Helvetica Neue, sans-serif', color: '#999999' }}>
              {product.price_html ? (
                <span dangerouslySetInnerHTML={{ __html: product.price_html }} />
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
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-black text-white py-4 font-bold text-sm uppercase mb-4 hover:bg-gray-800 transition-colors">
              Add to cart
            </button>

            {/* Product Description */}
            {product.description && (
              <div className="border-t pt-6 mt-6">
                <h3 className="font-bold text-sm mb-3 uppercase">Description</h3>
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
    </main>
  );
}
