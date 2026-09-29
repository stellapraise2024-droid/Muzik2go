import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/instrumental {projectId, mood, style?, keepVocal: true}
// Instrumental dev (concepts only in 6c — no full generation): mood/style/arrangement outline built around vocal/melody.
// Works around existing beat if instrumental_url set (never overwrites it).
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, mood, style } = await req.json();
  if (!projectId || !mood) return NextResponse.json({ error: "projectId + mood required" }, { status: 400 });
  // TODO: outline {bpm, key, sections[{section, chords, groove}], reference} — full audio gen deferred
  return NextResponse.json({ projectId, mood, style: style ?? "any", outline: "stub", respectsExistingBeat: true });
}
