"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartContent() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="text-4xl font-light mb-8">Shopping Cart</h1>
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase hover:bg-gray-800 transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-16">
      <div className="w-full px-6">
        <h1 className="text-4xl font-light mb-8">
          Shopping Cart ({totalItems})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border-b pb-4 mb-4 grid grid-cols-12 gap-4 text-sm font-bold uppercase text-gray-500">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="border-b py-6 grid grid-cols-12 gap-4 items-center"
              >
                {/* Product Info */}
                <div className="col-span-6 flex gap-4">
                  {item.image && (
                    <Link
                      href={`/shop/${item.slug}`}
                      className="relative w-24 h-24 bg-gray-100 flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  )}
                  <div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-bold hover:opacity-60"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-600 hover:underline mt-2 block"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center">
                  €{parseFloat(item.price).toFixed(2)}
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right font-bold">
                  €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border p-6 sticky top-32">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 font-bold text-sm uppercase mb-3 hover:bg-gray-800 transition-colors">
                <Link href="/checkout" className="block">
                  Proceed to checkout
                </Link>
              </button>

              <Link
                href="/shop"
                className="block text-center text-sm hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
