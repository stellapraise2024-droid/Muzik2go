import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects } from "@/lib/schema";

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
  return NextResponse.json({ project }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, title, lyricsText, structure, status } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, projectId),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const patch: Partial<typeof songProjects.$inferInsert> = {};
  if (title !== undefined) patch.title = String(title);
  if (lyricsText !== undefined) patch.lyricsText = String(lyricsText);
  if (structure !== undefined) patch.structure = Array.isArray(structure) ? structure : [];
  if (status !== undefined) patch.status = String(status);

  const [updated] = await db.update(songProjects).set(patch)
    .where(eq(songProjects.id, projectId)).returning();
  return NextResponse.json({ project: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, projectId),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  await db.delete(songProjects).where(eq(songProjects.id, projectId));
  return NextResponse.json({ ok: true });
}
