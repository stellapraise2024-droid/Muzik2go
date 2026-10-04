import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/master {projectId, takeId} → {jobId} — master preset (beyond Polish): LUFS + limiter + stereo widen (light).
// Output = new immutable take (processing=mastered) + what-changed. True stem mastering deferred.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, takeId } = await req.json();
  if (!projectId || !takeId) return NextResponse.json({ error: "projectId + takeId required" }, { status: 400 });
  // TODO: BullMQ → worker ffmpeg (loudnorm + alimiter) → processed/ take
  return NextResponse.json({ jobId: "stub", chain: ["loudnorm", "alimiter", "widen-light"], output: "Master preset" });
}
