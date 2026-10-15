import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { groqChat } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, mood, style } = await req.json();
  if (!projectId || !mood) return NextResponse.json({ error: "projectId + mood required" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, projectId as string),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const styleHint = style ? ` Style: ${style}.` : "";
  const prompt = `Create a musical instrumental outline for a song with mood "${mood}".${styleHint} Return JSON: { bpm: number, key: string, sections: [{ section: string, chords: string, groove: string }], reference: string }. Keep it concise.`;

  try {
    const response = await groqChat("You are an AI music producer. Return only valid JSON.", prompt);
    const outline = JSON.parse(response);
    return NextResponse.json({ projectId, mood, style: style ?? "any", outline, respectsExistingBeat: !!project.instrumentalUrl });
  } catch {
    return NextResponse.json({
      projectId,
      mood,
      style: style ?? "any",
      outline: {
        bpm: 90,
        key: "C major",
        sections: [
          { section: "Verse", chords: "C - G - Am - F", groove: "laid-back" },
          { section: "Chorus", chords: "F - G - C - Am", groove: "uplifting" },
        ],
        reference: `Mood: ${mood}`,
      },
      respectsExistingBeat: !!project.instrumentalUrl,
    });
  }
}
