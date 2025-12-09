import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Forward the access_token cookie to the backend
    const accessToken = request.cookies.get("access_token")?.value;

    const response = await fetch(`${API_URL}/pages/${slug}/password`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Cookie: `access_token=${accessToken}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { detail: "Failed to fetch password" },
      { status: 500 }
    );
  }
}
