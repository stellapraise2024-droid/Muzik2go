import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { groqChat } from "@/lib/groq";

const PLAY_SYSTEM = `You are Muzik2Go's Creative Partner. Given a song idea and a direction (lyrics, melody, structure, or mood), sketch one concrete alternative ("What if?"). Keep it short and singable. The original is never mutated.`;

// POST /api/playground {projectId, branchFrom?, prompt, direction?} — live via Groq.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, branchFrom, prompt, direction } = await req.json();
  if (!projectId || !prompt) return NextResponse.json({ error: "projectId + prompt required" }, { status: 400 });
  try {
    const reply = await groqChat(PLAY_SYSTEM, `Direction: ${direction ?? "lyrics"}\nIdea: ${prompt}`);
    return NextResponse.json({ branchId: `br_${Date.now()}`, projectId, branchFrom: branchFrom ?? "original", direction: direction ?? "lyrics", reply, note: "original preserved" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}

// GET /api/playground?projectId= — list branches (stub until DB wired)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ branches: [{ id: "original", label: "Original" }] });
}
