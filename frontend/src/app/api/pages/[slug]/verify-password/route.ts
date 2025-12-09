import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/pages/${slug}/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Create response
    const res = NextResponse.json(data, { status: response.status });

    // Forward Set-Cookie header if present
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
    }

    // Also set our own cookie for client-side access check
    if (response.ok && data.granted) {
      res.cookies.set(`page_access_${slug}`, "granted", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });
    }

    return res;
  } catch (error) {
    return NextResponse.json(
      { detail: "Failed to verify password" },
      { status: 500 }
    );
  }
}
