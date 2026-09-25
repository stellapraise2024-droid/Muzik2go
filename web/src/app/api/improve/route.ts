import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/improve {takeId, projectId, level: analyze|guide|assist|polish}
// Levels: Analyze (report) / Guide (steps) / Assist (EQ/comp/denoise tunable) / Polish (demo chain).
// Each run → new immutable take with parentTakeId + what-changed list. Original never mutated. No true Master in MVP.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { takeId, projectId, level } = await req.json();
  if (!takeId || !projectId || !level) return NextResponse.json({ error: "takeId + projectId + level required" }, { status: 400 });
  const chains: Record<string, string[]> = {
    analyze: ["report"],
    guide: ["report", "steps"],
    assist: ["trim", "gain", "normalize", "EQ preset", "comp light", "gate"],
    polish: ["trim", "denoise", "EQ", "comp", "vocal rider", "normalize"],
  };
  if (!chains[level]) return NextResponse.json({ error: "invalid level" }, { status: 400 });
  // TODO: BullMQ job → worker ffmpeg chain → new take (processed/) + diff text
  return NextResponse.json({ jobId: "stub", level, chain: chains[level], output: "Demo Polish", parentTakeId: takeId });
}
