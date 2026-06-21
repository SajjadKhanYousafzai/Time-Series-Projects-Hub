import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get("asset") || "bitcoin";
  const endpoint = searchParams.get("endpoint") || "history";
  const limit = searchParams.get("limit") || "100";

  try {
    const backendUrl = `${BACKEND_URL}/api/v1/${endpoint}/${asset}?limit=${limit}`;
    const res = await fetch(backendUrl, {
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Backend request failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Return sample data when backend is unavailable
    return NextResponse.json({
      asset,
      message: "Backend unavailable — returning sample data",
      records: [],
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Prediction request failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
