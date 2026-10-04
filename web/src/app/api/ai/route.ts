import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { groqChat } from "@/lib/groq";

const COACH_SYSTEM = `You are Muzik2Go's AI Vocal Coach. Explain what happened in the singer's take and how to improve, in plain language. Never give only a score. Give 2-3 strengths, then 1 specific fix with a practice exercise. The artist decides what stays.`;

// POST /api/ai {projectId, takeId?, messages[]} — Coach role (Phase 3). Live via Groq.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, messages } = await req.json();
  if (!projectId || !messages?.length) return NextResponse.json({ error: "projectId + messages required" }, { status: 400 });
  try {
    const reply = await groqChat(COACH_SYSTEM, messages.map((m: { content: string }) => m.content).join("\n"));
    return NextResponse.json({ role: "coach", reply, actions: ["Turn into Exercise"] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
