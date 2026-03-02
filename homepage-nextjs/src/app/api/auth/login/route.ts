import { NextResponse } from "next/server";

const jsonResponse = (data: unknown, status = 200) =>
  new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const dynamic = "force-dynamic";

const API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "http://wasted-talent.local/wp-json/site-manager/v1";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return jsonResponse(
        { success: false, message: data.message || "Login failed" },
        res.status,
      );
    }

    return jsonResponse(data);
  } catch (error) {
    console.error("Login API Error:", error);
    return jsonResponse(
      { success: false, message: "Internal server error" },
      500,
    );
  }
}
