// /app/api/check-write-limit/route.ts

import { NextRequest, NextResponse } from "next/server";

// TEMP: shared in-memory store (must match generate.ts store)
const userWriteUsage: Record<number, number> = {};
const MAX_WRITES = 3;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const count = userWriteUsage[userId] ?? 0;
    const limitHit = count >= MAX_WRITES;

    return NextResponse.json({ limitHit, count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to check write limit" }, { status: 500 });
  }
}
