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

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const consumerKey = process.env.WC_CONSUMER_KEY || "";
    const consumerSecret = process.env.WC_CONSUMER_SECRET || "";

    if (!consumerKey || !consumerSecret) {
      return jsonResponse({ error: "Missing WooCommerce credentials" }, 500);
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64",
    );
    const url = `${WC_API_URL}/products/${params.id}/variations?per_page=100`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("WooCommerce Variations API Error:", res.status, errorText);
      return jsonResponse(
        { error: "Failed to fetch variations", details: errorText },
        res.status,
      );
    }

    const variations = await res.json();
    return jsonResponse(variations);
  } catch (error) {
    console.error("Variations API Route Error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
