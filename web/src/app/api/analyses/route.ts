import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/analyses {takeId, projectId} → {jobId} (enqueue BullMQ → FastAPI worker, p95 <60s)
// GET /api/analyses?takeId= → report {strengths[2-3], fix, suggestions, metrics} (explain, never score-only)
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { takeId, projectId } = await req.json();
  if (!takeId || !projectId) return NextResponse.json({ error: "takeId + projectId required" }, { status: 400 });
  // TODO: insert analysis_jobs queued, BullMQ add
  return NextResponse.json({ jobId: "stub", status: "queued", slaSec: 30 });
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const takeId = new URL(req.url).searchParams.get("takeId");
  if (!takeId) return NextResponse.json({ error: "takeId required" }, { status: 400 });
  return NextResponse.json({
    takeId,
    strengths: ["Stable pitch through chorus", "Consistent timing on entry"],
    fix: { where: "line 2 final note", what: "-40 cents flat", exerciseId: "pitch-02" },
    suggestions: [{ exerciseId: "pitch-02", label: "Turn into Exercise" }],
  });
}
