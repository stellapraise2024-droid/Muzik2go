import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/layers {recordingId, projectId, type: harmony|double|adlib, audioKey} — stack a vocal layer take.
// Layers are takes with type set; comping picks best per layer. Mix preview client-side (no DAW in MVP).
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { recordingId, projectId, type, audioKey } = await req.json();
  if (!recordingId || !projectId || !type || !audioKey)
    return NextResponse.json({ error: "recordingId + projectId + type + audioKey required" }, { status: 400 });
  if (!["harmony", "double", "adlib"].includes(type)) return NextResponse.json({ error: "invalid type" }, { status: 400 });
  // TODO: insert take with type, parentTakeId null (layers are originals, not improvements)
  return NextResponse.json({ ok: true, stub: { recordingId, type } });
}

// GET /api/layers?projectId=&section= — list layer takes grouped by type for comping UI
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ layers: { harmony: [], double: [], adlib: [] } });
}
