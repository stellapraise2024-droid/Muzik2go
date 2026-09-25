import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/ai {projectId, takeId?, messages[]} — Coach role ONLY in Phase 3 (purple).
// Server injects last analyses + vocal profile summary; typed input only; every issue → exercise link.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, messages } = await req.json();
  if (!projectId || !messages?.length) return NextResponse.json({ error: "projectId + messages required" }, { status: 400 });
  // TODO: fetch context, call LLM with coach system prompt, rate-limit 30/min, log cost_cents
  return NextResponse.json({ role: "coach", reply: "stub — wire LLM in runtime env", actions: ["Turn into Exercise"] });
}
