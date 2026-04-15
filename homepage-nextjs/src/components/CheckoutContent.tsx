"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutContent() {
  const { items, totalPrice, totalItems } = useCart();
  const { user, getAddress } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Pre-fill form with logged-in user data
  useEffect(() => {
    if (!user) return;

    // Start with user basic info
    setFormData((prev) => ({
      ...prev,
      email: prev.email || user.email || "",
      firstName: prev.firstName || user.firstName || "",
      lastName: prev.lastName || user.lastName || "",
    }));

    // Fetch shipping address first (priority), then billing as fallback
    Promise.all([getAddress("shipping"), getAddress("billing")]).then(
      ([shippingRes, billingRes]) => {
        const ship = shippingRes.success ? shippingRes.data : null;
        const bill = billingRes.success ? billingRes.data : null;

        setFormData((prev) => ({
          ...prev,
          email: prev.email || bill?.email || user.email || "",
          firstName:
            prev.firstName ||
            ship?.firstName ||
            bill?.firstName ||
            user.firstName ||
            "",
          lastName:
            prev.lastName ||
            ship?.lastName ||
            bill?.lastName ||
            user.lastName ||
            "",
          address: prev.address || ship?.address1 || bill?.address1 || "",
          city: prev.city || ship?.city || bill?.city || "",
          postalCode: prev.postalCode || ship?.postcode || bill?.postcode || "",
          country: prev.country || ship?.country || bill?.country || "",
          phone: prev.phone || ship?.phone || bill?.phone || "",
        }));

        // Pre-fill billing data from billing address
        if (bill) {
          setBillingData((prev) => ({
            ...prev,
            firstName: prev.firstName || bill.firstName || "",
            lastName: prev.lastName || bill.lastName || "",
            address: prev.address || bill.address1 || "",
            city: prev.city || bill.city || "",
            postalCode: prev.postalCode || bill.postcode || "",
            country: prev.country || bill.country || "",
            phone: prev.phone || bill.phone || "",
          }));
        }
      },
    );
  }, [user, getAddress]);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-3 md:px-6">
          <div className="max-w-2xl mx-auto text-center py-20">
            <h1 className="font-light mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">
              Add some items to your cart before checking out.
            </p>
            <button
              onClick={() => router.push("/shop")}
              className="bg-[#222222] text-white px-8 py-3 text-sm font-bold uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const field = name.replace("billing_", "");
    setBillingData({
      ...billingData,
      [field]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.firstName)
      newErrors.firstName = "Please enter your first name";
    if (!formData.lastName) newErrors.lastName = "Please enter your last name";
    if (!formData.address) newErrors.address = "Please enter your address";
    if (!formData.city) newErrors.city = "Please enter your city";
    if (!formData.postalCode)
      newErrors.postalCode = "Please enter your postal code";
    if (!formData.country) newErrors.country = "Please select a country";
    if (!formData.phone) newErrors.phone = "Please enter your phone number";

    // Validate billing if different from shipping
    if (!sameAsShipping) {
      if (!billingData.firstName)
        newErrors.billing_firstName = "Please enter your first name";
      if (!billingData.lastName)
        newErrors.billing_lastName = "Please enter your last name";
      if (!billingData.address)
        newErrors.billing_address = "Please enter your address";
      if (!billingData.city) newErrors.billing_city = "Please enter your city";
      if (!billingData.postalCode)
        newErrors.billing_postalCode = "Please enter your postal code";
      if (!billingData.country)
        newErrors.billing_country = "Please select a country";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setOrderError("");

    try {
      const orderPayload = {
        items: items.map((item) => ({
          id: item.id,
          variationId: item.variationId || 0,
          quantity: item.quantity,
          size: item.size || "",
        })),
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        billing: sameAsShipping
          ? null
          : {
              firstName: billingData.firstName,
              lastName: billingData.lastName,
              address: billingData.address,
              city: billingData.city,
              postalCode: billingData.postalCode,
              country: billingData.country,
              phone: billingData.phone,
            },
        email: formData.email,
        sameAsShipping,
        cartTotal: totalPrice.toFixed(2),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create order");
      }

      // Redirect to WooPayments payment page
      // Cart will be cleared on the order confirmation page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        // Fallback: go to order confirmation directly (shouldn't happen with WooPayments)
        router.push(
          `/order-confirmation?id=${data.orderId}&key=${data.orderKey}`,
        );
      }
    } catch (error) {
      console.error("Order error:", error);
      setOrderError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  const shippingCost = totalPrice > 99 ? 0 : 10;
  const total = totalPrice + shippingCost;

  return (
    <main className="min-h-screen bg-white pt-32 pb-16">
      <div className="w-full px-3 md:px-6">
        <h1 className="font-light mb-8">Checkout</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 focus:outline-none ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#222222]"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full border px-4 py-3 focus:outline-none ${
                        errors.firstName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#222222]"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full border px-4 py-3 focus:outline-none ${
                        errors.lastName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#222222]"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 focus:outline-none ${
                      errors.address
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#222222]"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full border px-4 py-3 focus:outline-none ${
                        errors.city
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#222222]"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full border px-4 py-3 focus:outline-none ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#222222]"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#222222]"
                  >
                    <option value="">Select a country</option>
                    <option value="IT">Italy</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="ES">Spain</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full border px-4 py-3 focus:outline-none ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#222222]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="w-4 h-4 accent-[#222222]"
                />
                <span className="text-sm font-medium">
                  Shipping and billing details are the same
                </span>
              </label>

              {!sameAsShipping && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-4">
                    Billing Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="billing_firstName"
                          value={billingData.firstName}
                          onChange={handleBillingChange}
                          className={`w-full border px-4 py-3 focus:outline-none ${
                            errors.billing_firstName
                              ? "border-red-500"
                              : "border-gray-300 focus:border-[#222222]"
                          }`}
                        />
                        {errors.billing_firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billing_firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="billing_lastName"
                          value={billingData.lastName}
                          onChange={handleBillingChange}
                          className={`w-full border px-4 py-3 focus:outline-none ${
                            errors.billing_lastName
                              ? "border-red-500"
                              : "border-gray-300 focus:border-[#222222]"
                          }`}
                        />
                        {errors.billing_lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billing_lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="billing_address"
                        value={billingData.address}
                        onChange={handleBillingChange}
                        className={`w-full border px-4 py-3 focus:outline-none ${
                          errors.billing_address
                            ? "border-red-500"
                            : "border-gray-300 focus:border-[#222222]"
                        }`}
                      />
                      {errors.billing_address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billing_address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="billing_city"
                          value={billingData.city}
                          onChange={handleBillingChange}
                          className={`w-full border px-4 py-3 focus:outline-none ${
                            errors.billing_city
                              ? "border-red-500"
                              : "border-gray-300 focus:border-[#222222]"
                          }`}
                        />
                        {errors.billing_city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billing_city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="billing_postalCode"
                          value={billingData.postalCode}
                          onChange={handleBillingChange}
                          className={`w-full border px-4 py-3 focus:outline-none ${
                            errors.billing_postalCode
                              ? "border-red-500"
                              : "border-gray-300 focus:border-[#222222]"
                          }`}
                        />
                        {errors.billing_postalCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billing_postalCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country
                      </label>
                      <select
                        name="billing_country"
                        value={billingData.country}
                        onChange={handleBillingChange}
                        className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#222222]"
                      >
                        <option value="">Select a country</option>
                        <option value="IT">Italy</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                        <option value="ES">Spain</option>
                      </select>
                      {errors.billing_country && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billing_country}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="billing_phone"
                        value={billingData.phone}
                        onChange={handleBillingChange}
                        className={`w-full border px-4 py-3 focus:outline-none ${
                          errors.billing_phone
                            ? "border-red-500"
                            : "border-gray-300 focus:border-[#222222]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <div className="border border-gray-300 p-6">
                <div className="flex items-center gap-3">
                  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="3" fill="#1A1F71" />
                    <text
                      x="16"
                      y="13"
                      textAnchor="middle"
                      fill="white"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      CARD
                    </text>
                  </svg>
                  <p className="text-sm text-gray-600">
                    You will be redirected to complete payment securely.
                  </p>
                </div>
              </div>
              {orderError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{orderError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border p-6 sticky top-32">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {item.image && (
                      <div className="relative w-16 h-16 bg-gray-100 flex-shrink-0">
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
                      {item.size && (
                        <p className="text-sm text-gray-500">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-bold">
                      €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#222222] text-white py-4 font-bold text-sm uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all disabled:bg-gray-400"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
