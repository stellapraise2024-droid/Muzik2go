import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/projects — list own projects (Private by default)
// POST /api/projects {title, lyricsText?, structure?} — create
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // TODO Phase 1: drizzle select * from song_projects where ownerId = session.user.id order by created_at desc
  return NextResponse.json({ projects: [], note: "wire drizzle + DATABASE_URL in Phase 1 install" });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  // TODO: insert with visibility=private, status=idea
  return NextResponse.json({ ok: true, stub: body });
}
