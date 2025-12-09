import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Get all pages and find the one with matching slug
    const response = await fetch(`${API_URL}/pages/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const pages = await response.json();

    if (!response.ok) {
      return NextResponse.json(pages, { status: response.status });
    }

    const page = pages.find((p: { slug: string }) => p.slug === slug);

    if (!page) {
      return NextResponse.json(
        { detail: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      { detail: "Failed to fetch page" },
      { status: 500 }
    );
  }
}
