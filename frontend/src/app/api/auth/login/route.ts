import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Create response
    const res = NextResponse.json(data);

    // Parse and forward access_token cookie from backend
    // Use getSetCookie() which returns an array of Set-Cookie headers
    const cookies = response.headers.getSetCookie?.() || [];
    for (const cookie of cookies) {
      // Parse the access_token cookie
      if (cookie.startsWith("access_token=")) {
        const tokenMatch = cookie.match(/access_token=([^;]+)/);
        if (tokenMatch) {
          res.cookies.set("access_token", tokenMatch[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
          });
        }
      }
    }

    // Also store user info in a non-httponly cookie for client-side checks
    res.cookies.set("user", JSON.stringify(data.user), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { detail: "Failed to connect to server" },
      { status: 500 }
    );
  }
}
