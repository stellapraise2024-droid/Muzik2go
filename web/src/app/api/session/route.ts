import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/session {projectId, goal?} → 9-step guided session (Prepare→Warm up→Practice→Record→Analyze→Try→Compare→Develop→Save).
// Exitable any step; each step saves to Journey. Colors: cyan active, lime current, chrome rest.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, goal } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  return NextResponse.json({
    sessionId: "stub", projectId, goal: goal ?? "",
    steps: ["prepare", "warmup", "practice", "record", "analyze", "retry", "compare", "develop", "save"],
    exitable: true,
  });
}
