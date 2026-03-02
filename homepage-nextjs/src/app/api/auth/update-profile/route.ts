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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, ...profileData } = body;

    if (!token) {
      return jsonResponse(
        { success: false, message: "No token provided" },
        401,
      );
    }

    const res = await fetch(`${API_URL}/auth/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();

    if (!res.ok) {
      return jsonResponse(
        { success: false, message: data.message || "Update failed" },
        res.status,
      );
    }

    return jsonResponse(data);
  } catch (error) {
    console.error("Update Profile API Error:", error);
    return jsonResponse(
      { success: false, message: "Internal server error" },
      500,
    );
  }
}
