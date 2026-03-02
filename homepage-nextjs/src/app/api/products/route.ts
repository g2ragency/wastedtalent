import { NextResponse } from "next/server";

const jsonResponse = (data: unknown, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const dynamic = "force-dynamic";

const WC_API_URL = process.env.NEXT_PUBLIC_WP_API_URL
  ? process.env.NEXT_PUBLIC_WP_API_URL.replace("/site-manager/v1", "/wc/v3")
  : "http://wasted-talent.local/wp-json/wc/v3";

export async function GET() {
  try {
    const consumerKey = process.env.WC_CONSUMER_KEY || "";
    const consumerSecret = process.env.WC_CONSUMER_SECRET || "";

    console.log("API Route - Consumer Key exists:", !!consumerKey);
    console.log("API Route - Consumer Secret exists:", !!consumerSecret);
    console.log("API Route - WC URL:", WC_API_URL);

    if (!consumerKey || !consumerSecret) {
      return jsonResponse({ error: "Missing WooCommerce credentials" }, 500 );
    }

    // Use Basic Auth for local development
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64",
    );
    const url = `${WC_API_URL}/products?per_page=100`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("WooCommerce API Error:", res.status, errorText);
      return jsonResponse({ error: "Failed to fetch products", details: errorText }, res.status );
    }

    const products = await res.json();
    return jsonResponse(products);
  } catch (error) {
    console.error("API Route Error:", error);
    return jsonResponse({ error: "Internal server error" }, 500 );
  }
}
