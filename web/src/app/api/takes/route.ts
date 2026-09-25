import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/takes?projectId=&section=verse — list takes per section (keep-all, never overwrite)
// POST /api/takes {recordingId, projectId, audioKey, durationSec} — create new take
// PATCH /api/takes {takeId, isFavorite?, isSelected?} — star/select (select = one per section)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const section = searchParams.get("section");
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  // TODO: verify owner/collaborator, drizzle select takes where projectId (+section via recordings) order by created_at
  return NextResponse.json({ takes: [], projectId, section, note: "Phase 2 stub" });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.recordingId || !body?.projectId || !body?.audioKey)
    return NextResponse.json({ error: "recordingId + projectId + audioKey required" }, { status: 400 });
  // TODO: insert immutable take (processing=raw)
  return NextResponse.json({ ok: true, stub: body });
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { takeId, isFavorite, isSelected } = await req.json();
  if (!takeId) return NextResponse.json({ error: "takeId required" }, { status: 400 });
  // TODO: if isSelected=true, unset other selected in same recording (one best per section: Verse2/Chorus4/Bridge3)
  return NextResponse.json({ ok: true, takeId, isFavorite, isSelected });
}
