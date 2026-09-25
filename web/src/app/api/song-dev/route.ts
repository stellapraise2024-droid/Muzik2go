import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/song-dev {projectId, lyricsText?, structure?, mode: rhyme|brainstorm|contrast}
// Songwriter-lite: rhyme/brainstorm + verse-chorus contrast check. Original preserved (new version, never overwrite).
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, lyricsText, mode } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  // TODO: picks: per-line suggestions [{line, suggestion}], contrast report, Apply/Discard → new lyrics version
  return NextResponse.json({
    projectId, mode: mode ?? "contrast",
    suggestions: [{ line: 4, suggestion: "lift chorus with shorter lines" }],
    contrast: "Chorus strong; verse needs more contrast before it.",
    rule: "original preserved — apply creates new version",
  });
}
