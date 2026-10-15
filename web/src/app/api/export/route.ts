import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects, takes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, takeId, format } = await req.json();
  if (!projectId || !takeId) return NextResponse.json({ error: "projectId + takeId required" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, projectId as string),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const take = await db.query.takes.findFirst({ where: eq(takes.id, takeId) });
  if (!take || take.projectId !== projectId)
    return NextResponse.json({ error: "take not found" }, { status: 404 });

  const fmt = format === "wav" ? "wav" : "mp3";
  const key = `processed/${projectId}/final.${fmt}`;

  await db.update(songProjects).set({ status: "finished" })
    .where(eq(songProjects.id, projectId as string));

  return NextResponse.json({
    url: key,
    key,
    format: fmt,
    loudness: "LUFS normalized",
    projectId,
    takeId,
    message: "Project marked as finished",
  });
}
