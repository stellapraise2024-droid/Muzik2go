import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/journey — Artist Journey full timeline: sessions, songs, milestones, before/after pairs
// Feels like musical journey, not school report. Powers "months later, hear how much you've grown".
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    milestones: [{ id: "first-song", label: "First song finished" }, { id: "10-sessions", label: "10 sessions" }],
    timeline: [{ kind: "take", id: "stub" }, { kind: "analysis", id: "stub" }, { kind: "polish", id: "stub" }],
    beforeAfter: [{ beforeTakeId: "t1", afterTakeId: "t4", label: "Chorus growth" }],
  });
}
