import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { takes, recordings, songProjects } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { recordingId, projectId, type, audioKey } = await req.json();
  if (!recordingId || !projectId || !type || !audioKey)
    return NextResponse.json({ error: "recordingId + projectId + type + audioKey required" }, { status: 400 });
  if (!["harmony", "double", "adlib"].includes(type)) return NextResponse.json({ error: "invalid type" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, projectId as string),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const recording = await db.query.recordings.findFirst({
    where: eq(recordings.id, recordingId as string),
  });
  if (!recording || recording.projectId !== projectId)
    return NextResponse.json({ error: "recording not found" }, { status: 404 });

  const [take] = await db.insert(takes).values({
    recordingId,
    projectId,
    audioKey,
    processing: "raw",
  }).returning();

  return NextResponse.json({ take, type }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const section = searchParams.get("section");
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, projectId as string),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const recordingRows = section
    ? await db.select().from(recordings).where(
        and(eq(recordings.projectId, projectId as string), eq(recordings.section, section)),
      )
    : await db.select().from(recordings).where(eq(recordings.projectId, projectId as string));

  const recordingIds = recordingRows.map((r) => r.id);
  if (recordingIds.length === 0)
    return NextResponse.json({ layers: { harmony: [], double: [], adlib: [] } });

  const takeRows = await db.select().from(takes)
    .where(eq(takes.projectId, projectId as string))
    .orderBy(desc(takes.createdAt));

  const filtered = section
    ? takeRows.filter((t) => recordingIds.includes(t.recordingId))
    : takeRows;

  const layers: Record<string, typeof filtered> = { harmony: [], double: [], adlib: [] };
  for (const t of filtered) {
    const rec = recordingRows.find((r) => r.id === t.recordingId);
    if (rec && rec.type in layers) {
      layers[rec.type as keyof typeof layers].push(t);
    }
  }

  return NextResponse.json({ layers });
}
