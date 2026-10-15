import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analysisJobs, takes } from "@/lib/schema";
import { eq } from "drizzle-orm";

const CHAINS: Record<string, string[]> = {
  analyze: ["report"],
  guide: ["report", "steps"],
  assist: ["trim", "gain", "normalize", "EQ preset", "comp light", "gate"],
  polish: ["trim", "denoise", "EQ", "comp", "vocal rider", "normalize"],
};

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { takeId, projectId, level } = await req.json();
  if (!takeId || !projectId || !level) return NextResponse.json({ error: "takeId + projectId + level required" }, { status: 400 });
  if (!CHAINS[level]) return NextResponse.json({ error: "invalid level" }, { status: 400 });

  const take = await db.query.takes.findFirst({ where: eq(takes.id, takeId) });
  if (!take || take.projectId !== projectId)
    return NextResponse.json({ error: "take not found" }, { status: 404 });

  const [job] = await db.insert(analysisJobs).values({
    ownerId: session.user.id,
    takeId,
    status: "queued",
    result: { level, chain: CHAINS[level], parentTakeId: takeId },
  }).returning();

  return NextResponse.json({
    jobId: job.id,
    level,
    chain: CHAINS[level],
    status: "queued",
    parentTakeId: takeId,
    message: "Improvement pipeline queued — original take preserved",
  }, { status: 201 });
}
