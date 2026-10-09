import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects } from "@/lib/schema";

// GET /api/projects — list own projects (Private by default)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const projects = await db
    .select()
    .from(songProjects)
    .where(eq(songProjects.ownerId, session.user.id))
    .orderBy(desc(songProjects.createdAt));
  return NextResponse.json({ projects });
}

// POST /api/projects {title, lyricsText?, structure?} — create (private, idea)
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const [project] = await db
    .insert(songProjects)
    .values({
      ownerId: session.user.id,
      title: String(body.title),
      lyricsText: body.lyricsText ? String(body.lyricsText) : "",
      structure: Array.isArray(body.structure) ? body.structure : [],
      status: "idea",
      visibility: "private",
    })
    .returning();
  return NextResponse.json({ project });
}
