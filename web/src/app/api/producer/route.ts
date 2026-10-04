import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { groqChat } from "@/lib/groq";

const PRODUCER_SYSTEM = `You are Muzik2Go's AI Producer. Given a song brief, propose exactly 3 distinct musical directions (title + 1-line arrangement each). Never change the song yourself; the artist picks. Honor: "Don't change my song. Just show me what else it could become."`;

// POST /api/producer {projectId, takeId?, brief} — live via Groq.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, brief } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  try {
    const reply = await groqChat(PRODUCER_SYSTEM, `Brief: ${brief ?? "Give me 3 directions for this song."}`);
    return NextResponse.json({ projectId, reply });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
