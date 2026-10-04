import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { groqChat } from "@/lib/groq";

const WRITER_SYSTEM = `You are Muzik2Go's AI Songwriter. Suggest lyric/structure improvements as concrete per-line edits plus a verse-chorus contrast note. The original is preserved; the artist applies or discards each suggestion.`;

// POST /api/song-dev {projectId, lyricsText?, structure?, mode} — live via Groq.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, lyricsText, mode } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  try {
    const reply = await groqChat(WRITER_SYSTEM, `Mode: ${mode ?? "contrast"}\nLyrics:\n${lyricsText ?? "(none yet)"}`);
    return NextResponse.json({ projectId, mode: mode ?? "contrast", reply, rule: "original preserved" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
