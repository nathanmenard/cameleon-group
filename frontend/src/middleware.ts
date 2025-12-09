import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// WHITELIST approach: Only these routes are public, everything else requires auth
const PUBLIC_ROUTES = [
  "/login",
  "/clients", // All client pages (with their own password protection)
];

// Static assets and API routes that should always pass through
const BYPASS_ROUTES = [
  "/_next",
  "/api", // API routes handle their own auth
  "/logos",
  "/favicon.ico",
];

function isPublicRoute(pathname: string): boolean {
  // Check exact matches or prefix matches
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function shouldBypass(pathname: string): boolean {
  return BYPASS_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always bypass static assets and API routes
  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // For all other routes (admin, dashboard, etc.), check for auth cookie
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    // Not authenticated - redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Has token - allow access (token validation happens server-side)
  return NextResponse.next();
}

export const config = {
  // Match all routes except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
