import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects, recordings, takes, practiceSessions, aiAnalyses, voiceProfiles, chatMessages, analysisJobs, feedback } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const projects = await db.select().from(songProjects).where(eq(songProjects.ownerId, userId));
  const projectIds = projects.map((p) => p.id);

  if (projectIds.length > 0) {
    await db.delete(takes).where(eq(takes.projectId, projectIds[0]));
    for (const pid of projectIds.slice(1)) {
      await db.delete(takes).where(eq(takes.projectId, pid));
    }
    await db.delete(recordings).where(eq(recordings.projectId, projectIds[0]));
    for (const pid of projectIds.slice(1)) {
      await db.delete(recordings).where(eq(recordings.projectId, pid));
    }
    await db.delete(aiAnalyses).where(eq(aiAnalyses.projectId, projectIds[0]));
    for (const pid of projectIds.slice(1)) {
      await db.delete(aiAnalyses).where(eq(aiAnalyses.projectId, pid));
    }
    await db.delete(analysisJobs).where(eq(analysisJobs.takeId, projectIds[0]));
    await db.delete(chatMessages).where(eq(chatMessages.projectId, projectIds[0]));
    for (const pid of projectIds.slice(1)) {
      await db.delete(chatMessages).where(eq(chatMessages.projectId, pid));
    }
  }

  await db.delete(practiceSessions).where(eq(practiceSessions.ownerId, userId));
  await db.delete(voiceProfiles).where(eq(voiceProfiles.ownerId, userId));
  await db.delete(aiAnalyses).where(eq(aiAnalyses.ownerId, userId));
  await db.delete(feedback).where(eq(feedback.ownerId, userId));

  await db.delete(songProjects).where(eq(songProjects.ownerId, userId));

  try {
    await auth.api.deleteUser({ headers: req.headers });
  } catch {}

  return NextResponse.json({ ok: true, purged: true });
}
