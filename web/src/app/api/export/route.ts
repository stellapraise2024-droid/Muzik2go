import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/export {projectId, takeId, format: wav|mp3} → {url}
// Finish-lite: Final flag + LUFS-normalized export (file download only, no DSP distribution).
// A/B data comes from takes (original parentTakeId vs improved) — loudness-matched toggle on client.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, takeId, format } = await req.json();
  if (!projectId || !takeId) return NextResponse.json({ error: "projectId + takeId required" }, { status: 400 });
  // TODO: mark project finished, worker LUFS normalize → processed/{projectId}/final.{wav,mp3} → presigned GET
  return NextResponse.json({ url: "stub", key: `processed/${projectId}/final.${format ?? "mp3"}`, loudness: "LUFS normalized" });
}
