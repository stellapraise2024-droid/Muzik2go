import { NextRequest, NextResponse } from "next/server";

// POST /api/feedback {kind: crash|idea|bug, message, meta?} — 30s tester feedback, no auth required for crash logs.
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.message) return NextResponse.json({ error: "message required" }, { status: 400 });
  // TODO: store to feedback table / forward to Discord/Slack webhook
  return NextResponse.json({ ok: true });
}
