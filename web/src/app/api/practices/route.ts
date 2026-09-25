import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/practices — history (streak, counts, last 5)
// POST /api/practices {exerciseId, projectId?, takeId?, durationSec} — log completion (offline_queued supported)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ sessions: [], streakDays: 0, note: "Page 2 Progress reads this" });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.exerciseId) return NextResponse.json({ error: "exerciseId required" }, { status: 400 });
  return NextResponse.json({ ok: true, stub: body });
}
