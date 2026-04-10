"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface OrderLineItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
  image?: string;
}

interface OrderData {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
  line_items: OrderLineItem[];
  payment_method_title: string;
  shipping_total: string;
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const orderKey = searchParams.get("key");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart
    clearCart();
    localStorage.removeItem("cart");

    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const params = new URLSearchParams({ id: orderId });
        if (orderKey) params.append("key", orderKey);

        const res = await fetch(`/api/orders?${params.toString()}`);
        const data = await res.json();

        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError("Could not load order details.");
        }
      } catch {
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orderKey]);

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pending Payment",
      processing: "Processing",
      "on-hold": "On Hold",
      completed: "Completed",
      cancelled: "Cancelled",
      refunded: "Refunded",
      failed: "Failed",
    };
    return statusMap[status] || status;
  };

  // Generic confirmation (no order ID — fallback)
  if (!orderId && !loading) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-3 md:px-6">
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

            <h1 className="font-light mb-4">Thank you for your order!</h1>
            <p className="text-gray-600 mb-8">
              Your order has been received and is being processed. You will
              receive a confirmation email shortly.
            </p>

            <div className="space-y-4">
              <Link
                href="/shop"
                className="inline-block bg-[#222222] text-white px-8 py-3 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
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

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-3 md:px-6">
          <div className="text-center py-20">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-3 md:px-6">
          <div className="text-center py-20">
            <h1 className="font-light mb-4">Order Confirmation</h1>
            <p className="text-gray-600 mb-8">
              {error || "Could not load order details."}
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#222222] text-white px-8 py-3 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Calculate subtotal from line items
  const subtotal = order.line_items.reduce(
    (sum, item) => sum + parseFloat(item.total),
    0,
  );
  const shippingTotal = parseFloat(order.shipping_total) || 0;

  return (
    <main className="min-h-screen bg-white pt-32 pb-16">
      <div className="w-full px-3 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-10">
            <div className="mb-6">
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
            <h1 className="font-light mb-2">Thank you for your order!</h1>
            <p className="text-gray-500 text-sm">
              Order #{order.number} •{" "}
              {new Date(order.date_created).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p
              className="inline-block mt-3 px-3 py-1 text-xs font-bold uppercase"
              style={{
                backgroundColor:
                  order.status === "processing" || order.status === "completed"
                    ? "#E8F5E9"
                    : "#FFF3E0",
                color:
                  order.status === "processing" || order.status === "completed"
                    ? "#2E7D32"
                    : "#E65100",
              }}
            >
              {formatStatus(order.status)}
            </p>
          </div>

          {/* Order Items */}
          <div className="border-t border-b py-6 mb-6">
            <h2 className="font-bold mb-4">Items</h2>
            <div className="space-y-4">
              {order.line_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.image && (
                    <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    €{parseFloat(item.total).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Shipping</span>
              <span>
                {shippingTotal === 0 ? "Free" : `€${shippingTotal.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total</span>
              <span>€{parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-bold text-sm mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.shipping.first_name} {order.shipping.last_name}
                <br />
                {order.shipping.address_1}
                <br />
                {order.shipping.city}, {order.shipping.postcode}
                <br />
                {order.shipping.country}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">Billing Address</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.billing.first_name} {order.billing.last_name}
                <br />
                {order.billing.address_1}
                <br />
                {order.billing.city}, {order.billing.postcode}
                <br />
                {order.billing.country}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="mb-10">
            <h3 className="font-bold text-sm mb-2">Payment Method</h3>
            <p className="text-sm text-gray-600">
              {order.payment_method_title || "Credit Card"}
            </p>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <Link
              href="/shop"
              className="inline-block bg-[#222222] text-white px-8 py-3 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
            >
              Continue shopping
            </Link>
            <div>
              <Link
                href="/account/orders"
                className="text-sm hover:underline mr-6"
              >
                View your orders
              </Link>
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
