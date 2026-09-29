import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/playground {projectId, branchFrom: takeId|lyricsVersion, prompt, direction: lyrics|melody|structure|mood}
// Non-destructive branches ("What if?"): original preserved, each experiment = new branch. LLM via Groq (GROQ_API_KEY).
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, branchFrom, prompt, direction } = await req.json();
  if (!projectId || !prompt) return NextResponse.json({ error: "projectId + prompt required" }, { status: 400 });
  // TODO: picks Groq model (llama-3.3-70b) via web/src/lib/groq.ts, save branch {id, parent: branchFrom, direction, output}
  return NextResponse.json({ branchId: "stub", projectId, branchFrom: branchFrom ?? "original", direction: direction ?? "lyrics", note: "original preserved" });
}

// GET /api/playground?projectId= — list branches for picker (Original + alternatives)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ branches: [{ id: "original", label: "Original" }] });
}
