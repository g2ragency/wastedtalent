"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WooCommerceProduct } from "@/lib/api";

interface ProductDetailProps {
  product: WooCommerceProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 bg-gray-100" style={{ height: '600px' }}>
              {product.images && product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].src}
                  alt={product.images[selectedImage].alt || product.name}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-100 aspect-square overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
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

            {/* Additional Info */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-sm mb-3 uppercase">Product Details</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• 100% Cotton</li>
                <li>• Made in Italy</li>
                <li>• Machine washable</li>
                <li>• Regular fit</li>
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-sm mb-3 uppercase">Shipping & Returns</h3>
              <p className="text-sm text-gray-700 mb-2">
                Free shipping on orders over €100
              </p>
              <p className="text-sm text-gray-700">
                30-day return policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 mt-20 pt-12 border-t">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Join our newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-mail address"
                className="flex-1 border-b border-black pb-2 text-sm focus:outline-none"
              />
              <button className="text-xl">→</button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              You may unsubscribe at any time. To find out more, please visit our Privacy Policy.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Help center</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/shipping">Shipping & FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Follow us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
              <li><a href="https://spotify.com" target="_blank">Spotify</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Policy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between py-6 border-t">
          <div className="text-sm">
            ©2026 Wasted Talent United - All Rights Reserved
          </div>
        </div>
      </footer>
    </main>
  );
}
