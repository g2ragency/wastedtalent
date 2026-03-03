import { NextRequest, NextResponse } from "next/server";

const jsonResponse = (data: unknown, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const dynamic = "force-dynamic";

const API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "http://wasted-talent.local/wp-json/site-manager/v1";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (!token) {
      return jsonResponse(
        { success: false, message: "No token provided" },
        401,
      );
    }

    if (!type) {
      return jsonResponse(
        { success: false, message: "Address type required" },
        400,
      );
    }

    const res = await fetch(`${API_URL}/auth/get-address?type=${type}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return jsonResponse(
        { success: false, message: data.message || "Failed to get address" },
        res.status,
      );
    }

    return jsonResponse(data);
  } catch (error) {
    console.error("Get Address API Error:", error);
    return jsonResponse(
      { success: false, message: "Internal server error" },
      500,
    );
  }
}
