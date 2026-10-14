import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects, takes, recordings, practiceSessions, aiAnalyses } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const projects = await db.select().from(songProjects)
    .where(eq(songProjects.ownerId, session.user.id))
    .orderBy(desc(songProjects.createdAt));

  const takeRows = await db.select().from(takes)
    .orderBy(desc(takes.createdAt));

  const practiceRows = await db.select().from(practiceSessions)
    .where(eq(practiceSessions.ownerId, session.user.id))
    .orderBy(desc(practiceSessions.createdAt));

  const analysisRows = await db.select().from(aiAnalyses)
    .where(eq(aiAnalyses.ownerId, session.user.id))
    .orderBy(desc(aiAnalyses.createdAt));

  const milestones: Array<{ id: string; label: string; date: string }> = [];

  if (projects.length > 0) {
    milestones.push({
      id: "first-project",
      label: "First song project created",
      date: projects[0].createdAt.toISOString(),
    });
  }
  const finished = projects.filter((p) => p.status === "finished");
  if (finished.length > 0) {
    milestones.push({
      id: "first-finished",
      label: "First song finished",
      date: finished[0].createdAt.toISOString(),
    });
  }
  if (takeRows.length >= 5) {
    milestones.push({
      id: "5-takes",
      label: "5 takes recorded",
      date: takeRows[4].createdAt.toISOString(),
    });
  }
  if (takeRows.length >= 10) {
    milestones.push({
      id: "10-takes",
      label: "10 takes recorded",
      date: takeRows[9].createdAt.toISOString(),
    });
  }
  if (practiceRows.length >= 5) {
    milestones.push({
      id: "5-practices",
      label: "5 practice sessions",
      date: practiceRows[4].createdAt.toISOString(),
    });
  }
  if (practiceRows.length >= 10) {
    milestones.push({
      id: "10-practices",
      label: "10 practice sessions",
      date: practiceRows[9].createdAt.toISOString(),
    });
  }
  if (analysisRows.length > 0) {
    milestones.push({
      id: "first-analysis",
      label: "First AI analysis",
      date: analysisRows[0].createdAt.toISOString(),
    });
  }

  const timeline: Array<{ kind: string; id: string; date: string; label: string }> = [];
  for (const p of projects.slice(0, 5)) {
    timeline.push({ kind: "project", id: p.id, date: p.createdAt.toISOString(), label: `Created "${p.title}"` });
  }
  for (const t of takeRows.slice(0, 5)) {
    timeline.push({ kind: "take", id: t.id, date: t.createdAt.toISOString(), label: `Take recorded (${t.durationSec}s)` });
  }
  for (const a of practiceRows.slice(0, 5)) {
    timeline.push({ kind: "practice", id: a.id, date: a.createdAt.toISOString(), label: `Practiced: ${a.exercise}` });
  }
  for (const an of analysisRows.slice(0, 5)) {
    timeline.push({ kind: "analysis", id: an.id, date: an.createdAt.toISOString(), label: `AI analysis: ${an.kind}` });
  }
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const beforeAfter: Array<{ beforeTakeId: string; afterTakeId: string; label: string }> = [];
  const parentTakes = takeRows.filter((t) => t.parentTakeId);
  for (const child of parentTakes.slice(0, 3)) {
    const parent = takeRows.find((t) => t.id === child.parentTakeId);
    if (parent) {
      beforeAfter.push({
        beforeTakeId: parent.id,
        afterTakeId: child.id,
        label: "Improved version",
      });
    }
  }

  return NextResponse.json({
    milestones,
    timeline: timeline.slice(0, 20),
    beforeAfter,
    stats: {
      totalProjects: projects.length,
      totalTakes: takeRows.length,
      totalPracticeSessions: practiceRows.length,
      totalAnalyses: analysisRows.length,
    },
  });
}
