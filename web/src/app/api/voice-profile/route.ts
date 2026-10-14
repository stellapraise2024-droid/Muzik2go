import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { voiceProfiles, takes, practiceSessions, aiAnalyses } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const profile = await db.query.voiceProfiles.findFirst({
    where: eq(voiceProfiles.ownerId, session.user.id),
  });

  const takeRows = await db.select().from(takes)
    .orderBy(desc(takes.createdAt));

  const practiceRows = await db.select().from(practiceSessions)
    .where(eq(practiceSessions.ownerId, session.user.id))
    .orderBy(desc(practiceSessions.createdAt));

  const analysisRows = await db.select().from(aiAnalyses)
    .where(eq(aiAnalyses.ownerId, session.user.id))
    .orderBy(desc(aiAnalyses.createdAt));

  const pitchScores = analysisRows
    .filter((a) => a.kind === "pitch" && a.content && typeof a.content === "object" && "score" in a.content)
    .map((a) => (a.content as { score: number }).score);

  const timingScores = analysisRows
    .filter((a) => a.kind === "timing" && a.content && typeof a.content === "object" && "score" in a.content)
    .map((a) => (a.content as { score: number }).score);

  const avgPitch = pitchScores.length > 0
    ? Math.round((pitchScores.reduce((a, b) => a + b, 0) / pitchScores.length) * 100) / 100
    : profile?.pitchScore || null;
  const avgTiming = timingScores.length > 0
    ? Math.round((timingScores.reduce((a, b) => a + b, 0) / timingScores.length) * 100) / 100
    : profile?.timingScore || null;

  const totalPracticeSec = practiceRows.reduce((acc, r) => acc + (r.durationSec || 0), 0);

  const strengths: string[] = [];
  const challenges: string[] = [];
  if (avgPitch && avgPitch > 0.75) strengths.push("Pitch consistency");
  if (avgTiming && avgTiming > 0.75) strengths.push("Timing accuracy");
  if (practiceRows.length >= 5) strengths.push("Regular practice habit");
  if (avgPitch && avgPitch < 0.6) challenges.push("Pitch stability — try slower tempos");
  if (avgTiming && avgTiming < 0.6) challenges.push("Timing — practice with metronome");
  if (practiceRows.length === 0) challenges.push("Start practicing to build your profile");

  return NextResponse.json({
    range: profile?.rangeLow && profile?.rangeHigh
      ? { low: profile.rangeLow, high: profile.rangeHigh }
      : null,
    comfortableRange: profile?.comfortableLow && profile?.comfortableHigh
      ? { low: profile.comfortableLow, high: profile.comfortableHigh }
      : null,
    strengths: strengths.length > 0 ? strengths : profile?.strengths || [],
    challenges: challenges.length > 0 ? challenges : profile?.challenges || [],
    scores: {
      pitch: avgPitch,
      timing: avgTiming,
      consistency: profile?.consistencyScore || null,
    },
    practiceCount: practiceRows.length,
    totalPracticeSec,
    lastPracticeAt: practiceRows[0]?.createdAt?.toISOString() || null,
    takeCount: takeRows.length,
    updatedAt: profile?.updatedAt?.toISOString() || null,
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();

  const existing = await db.query.voiceProfiles.findFirst({
    where: eq(voiceProfiles.ownerId, session.user.id),
  });

  const values = {
    ownerId: session.user.id,
    rangeLow: body.rangeLow || existing?.rangeLow || null,
    rangeHigh: body.rangeHigh || existing?.rangeHigh || null,
    comfortableLow: body.comfortableLow || existing?.comfortableLow || null,
    comfortableHigh: body.comfortableHigh || existing?.comfortableHigh || null,
    strengths: body.strengths || existing?.strengths || [],
    challenges: body.challenges || existing?.challenges || [],
    pitchScore: body.pitchScore ?? existing?.pitchScore ?? null,
    timingScore: body.timingScore ?? existing?.timingScore ?? null,
    consistencyScore: body.consistencyScore ?? existing?.consistencyScore ?? null,
    practiceCount: body.practiceCount ?? existing?.practiceCount ?? 0,
    totalPracticeSec: body.totalPracticeSec ?? existing?.totalPracticeSec ?? 0,
    lastPracticeAt: body.lastPracticeAt ? new Date(body.lastPracticeAt) : existing?.lastPracticeAt || null,
    updatedAt: new Date(),
  };

  if (existing) {
    const [updated] = await db.update(voiceProfiles).set(values)
      .where(eq(voiceProfiles.ownerId, session.user.id)).returning();
    return NextResponse.json({ profile: updated });
  }

  const [created] = await db.insert(voiceProfiles).values(values).returning();
  return NextResponse.json({ profile: created }, { status: 201 });
}
