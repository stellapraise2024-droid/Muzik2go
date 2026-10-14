import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { takes, recordings, songProjects } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

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
  if (recordingIds.length === 0) return NextResponse.json({ takes: [], projectId, section });

  const takeRows = await db.select().from(takes)
    .where(eq(takes.projectId, projectId as string))
    .orderBy(desc(takes.createdAt));

  const filtered = section
    ? takeRows.filter((t) => recordingIds.includes(t.recordingId))
    : takeRows;

  return NextResponse.json({ takes: filtered, projectId, section });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.recordingId || !body?.projectId || !body?.audioKey)
    return NextResponse.json({ error: "recordingId + projectId + audioKey required" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, body.projectId),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const recording = await db.query.recordings.findFirst({
    where: eq(recordings.id, body.recordingId),
  });
  if (!recording || recording.projectId !== body.projectId)
    return NextResponse.json({ error: "recording not found" }, { status: 404 });

  const [take] = await db.insert(takes).values({
    recordingId: body.recordingId,
    projectId: body.projectId,
    audioKey: body.audioKey,
    durationSec: body.durationSec || 0,
    processing: "raw",
  }).returning();

  return NextResponse.json({ take }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { takeId, isFavorite, isSelected } = await req.json();
  if (!takeId) return NextResponse.json({ error: "takeId required" }, { status: 400 });

  const take = await db.query.takes.findFirst({ where: eq(takes.id, takeId) });
  if (!take) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (isSelected) {
    await db.update(takes).set({ isSelected: false })
      .where(eq(takes.recordingId, take.recordingId));
  }

  const [updated] = await db.update(takes).set({
    isFavorite: isFavorite ?? take.isFavorite,
    isSelected: isSelected ?? take.isSelected,
  }).where(eq(takes.id, takeId)).returning();

  return NextResponse.json({ take: updated });
}
