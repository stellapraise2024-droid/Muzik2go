import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects, takes, practiceSessions, aiAnalyses, voiceProfiles } from "@/lib/schema";
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

  const profile = await db.query.voiceProfiles.findFirst({
    where: eq(voiceProfiles.ownerId, session.user.id),
  });

  const suggestions: Array<{ id: string; text: string; action: string; projectId?: string }> = [];

  const unfinished = projects.filter((p) => p.status !== "finished");
  if (unfinished.length >= 3) {
    suggestions.push({
      id: "guide-unfinished",
      text: `You have ${unfinished.length} unfinished songs — continue "${unfinished[0].title}"?`,
      action: "open-project",
      projectId: unfinished[0].id,
    });
  }

  const noLyrics = projects.filter((p) => !p.lyricsText || p.lyricsText.trim() === "");
  if (noLyrics.length > 0) {
    suggestions.push({
      id: "guide-lyrics",
      text: `"${noLyrics[0].title}" has no lyrics yet — start writing?`,
      action: "open-project",
      projectId: noLyrics[0].id,
    });
  }

  const noTakes = projects.filter((p) => p.status === "idea");
  if (noTakes.length > 0) {
    suggestions.push({
      id: "guide-first-take",
      text: `"${noTakes[0].title}" has no recordings — record your first take?`,
      action: "open-project",
      projectId: noTakes[0].id,
    });
  }

  if (profile?.pitchScore && profile.pitchScore > 0.7) {
    suggestions.push({
      id: "guide-pitch-good",
      text: "Your pitch is improving — challenge it with a harder song",
      action: "open-practice",
    });
  }

  if (practiceRows.length === 0 && projects.length > 0) {
    suggestions.push({
      id: "guide-practice",
      text: "You haven't practiced yet — warm up with a quick exercise",
      action: "open-practice",
    });
  }

  if (analysisRows.length === 0 && takeRows.length > 0) {
    suggestions.push({
      id: "guide-analyze",
      text: "You have takes but no analysis — let AI listen to your best take",
      action: "open-improve",
    });
  }

  if (suggestions.length === 0 && projects.length === 0) {
    suggestions.push({
      id: "guide-start",
      text: "Start your first song project",
      action: "open-projects",
    });
  }

  return NextResponse.json({
    suggestions: suggestions.slice(0, 5),
  });
}
