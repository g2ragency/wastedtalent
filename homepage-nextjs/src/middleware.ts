import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || "wtu-preview-2026";

export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  // Allow access to maintenance page itself, API routes, and static assets
  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // Check for preview bypass via query param — sets a cookie
  if (searchParams.get("preview") === PREVIEW_SECRET) {
    const response = NextResponse.next();
    response.cookies.set("wtu_preview", PREVIEW_SECRET, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  // Check for existing preview cookie
  const previewCookie = request.cookies.get("wtu_preview");
  if (previewCookie?.value === PREVIEW_SECRET) {
    return NextResponse.next();
  }

  // Redirect everyone else to maintenance page
  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = "/maintenance";
  return NextResponse.rewrite(maintenanceUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
