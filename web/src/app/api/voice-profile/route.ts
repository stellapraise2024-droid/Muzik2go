import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/voice-profile — My Voice full: range, comfortable range, strengths, recurring challenges, progress
// PUT /api/voice-profile — worker upserts after each analysis (pitch/timing/breath scores, range midi)
// Presents observations, never dictates identity. Powers personalized coaching ("more consistent in this range vs earlier").
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    range: { lowMidi: 48, highMidi: 72, comfortableLow: 55, comfortableHigh: 67 },
    strengths: ["chorus stability"], challenges: ["line-2 final (-40c)"],
    scores: { pitch: 0.82, timing: 0.78, breath: 0.71 }, updatedAt: "stub",
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  return NextResponse.json({ ok: true, stub: body });
}
