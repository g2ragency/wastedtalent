import { NextResponse, NextRequest } from "next/server";

const jsonResponse = (data: unknown, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const dynamic = "force-dynamic";

const WC_API_URL = process.env.NEXT_PUBLIC_WP_API_URL
  ? process.env.NEXT_PUBLIC_WP_API_URL.replace("/site-manager/v1", "/wc/v3")
  : "http://wasted-talent.local/wp-json/wc/v3";

// Frontend URL for redirects after payment
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.wastedtalent.it";

export async function POST(request: NextRequest) {
  try {
    const consumerKey = process.env.WC_CONSUMER_KEY || "";
    const consumerSecret = process.env.WC_CONSUMER_SECRET || "";

    if (!consumerKey || !consumerSecret) {
      return jsonResponse({ error: "Missing WooCommerce credentials" }, 500);
    }

    const body = await request.json();
    const { items, shipping, billing, email, sameAsShipping, cartTotal } = body;

    if (!items || items.length === 0) {
      return jsonResponse({ error: "Cart is empty" }, 400);
    }

    // Build line items for WooCommerce
    const line_items = items.map(
      (item: {
        id: number;
        variationId?: number;
        quantity: number;
        size?: string;
      }) => {
        const lineItem: {
          product_id: number;
          variation_id?: number;
          quantity: number;
        } = {
          product_id: item.id,
          quantity: item.quantity,
        };

        if (item.variationId) {
          lineItem.variation_id = item.variationId;
        }

        return lineItem;
      },
    );

    // Build billing address (use shipping if sameAsShipping)
    const billingAddress = sameAsShipping
      ? {
          first_name: shipping.firstName,
          last_name: shipping.lastName,
          address_1: shipping.address,
          city: shipping.city,
          postcode: shipping.postalCode,
          country: shipping.country,
          phone: shipping.phone,
          email: email,
        }
      : {
          first_name: billing.firstName,
          last_name: billing.lastName,
          address_1: billing.address,
          city: billing.city,
          postcode: billing.postalCode,
          country: billing.country,
          phone: billing.phone || shipping.phone,
          email: email,
        };

    // Build shipping address
    const shippingAddress = {
      first_name: shipping.firstName,
      last_name: shipping.lastName,
      address_1: shipping.address,
      city: shipping.city,
      postcode: shipping.postalCode,
      country: shipping.country,
    };

    // Free shipping for orders over €99
    const shippingTotal = (cartTotal && parseFloat(cartTotal) > 99) ? '0.00' : '10.00';

    // Create order payload
    const orderData = {
      payment_method: "woocommerce_payments",
      payment_method_title: "Carta di credito",
      set_paid: false,
      status: "pending",
      billing: billingAddress,
      shipping: shippingAddress,
      line_items,
      shipping_lines: [
        {
          method_id: shippingTotal === '0.00' ? 'free_shipping' : 'flat_rate',
          method_title: "Spedizione",
          total: shippingTotal,
        },
      ],
      // Tell WooCommerce where to redirect after payment
      meta_data: [
        {
          key: "_wc_order_return_url",
          value: `${FRONTEND_URL}/order-confirmation`,
        },
      ],
    };

    // Auth
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64",
    );
    const isHttps = WC_API_URL.startsWith("https");
    const url = isHttps
      ? `${WC_API_URL}/orders`
      : `${WC_API_URL}/orders?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (isHttps) {
      headers["Authorization"] = `Basic ${auth}`;
    }

    console.log("Creating WooCommerce order...", JSON.stringify(orderData));

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("WooCommerce Order Error:", res.status, errorText);
      return jsonResponse(
        { error: "Failed to create order", details: errorText },
        res.status,
      );
    }

    const order = await res.json();

    console.log("Order created:", order.id, "Status:", order.status);

    // WooCommerce returns a payment_url for pending orders
    // This is the URL where the customer completes payment
    const paymentUrl =
      order.payment_url ||
      `${WC_API_URL.replace("/wp-json/wc/v3", "")}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;

    return jsonResponse({
      success: true,
      orderId: order.id,
      orderKey: order.order_key,
      orderNumber: order.number,
      total: order.total,
      status: order.status,
      paymentUrl,
    });
  } catch (error) {
    console.error("Order API Error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}

// GET: Fetch order details by ID and key (for order confirmation page)
export async function GET(request: NextRequest) {
  try {
    const consumerKey = process.env.WC_CONSUMER_KEY || "";
    const consumerSecret = process.env.WC_CONSUMER_SECRET || "";

    if (!consumerKey || !consumerSecret) {
      return jsonResponse({ error: "Missing WooCommerce credentials" }, 500);
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");
    const orderKey = searchParams.get("key");

    if (!orderId) {
      return jsonResponse({ error: "Order ID is required" }, 400);
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64",
    );
    const isHttps = WC_API_URL.startsWith("https");
    const url = isHttps
      ? `${WC_API_URL}/orders/${orderId}`
      : `${WC_API_URL}/orders/${orderId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (isHttps) {
      headers["Authorization"] = `Basic ${auth}`;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) {
      return jsonResponse({ error: "Order not found" }, 404);
    }

    const order = await res.json();

    // Verify order key matches (security check)
    if (orderKey && order.order_key !== orderKey) {
      return jsonResponse({ error: "Invalid order key" }, 403);
    }

    return jsonResponse({
      success: true,
      order: {
        id: order.id,
        number: order.number,
        status: order.status,
        total: order.total,
        currency: order.currency,
        date_created: order.date_created,
        billing: order.billing,
        shipping: order.shipping,
        line_items: order.line_items.map(
          (item: {
            id: number;
            name: string;
            quantity: number;
            total: string;
            image?: { src: string };
          }) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            total: item.total,
            image: item.image?.src,
          }),
        ),
        payment_method_title: order.payment_method_title,
        shipping_total: order.shipping_total,
      },
    });
  } catch (error) {
    console.error("Order GET Error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
