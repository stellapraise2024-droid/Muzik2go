import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analysisJobs, takes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, takeId } = await req.json();
  if (!projectId || !takeId) return NextResponse.json({ error: "projectId + takeId required" }, { status: 400 });

  const take = await db.query.takes.findFirst({ where: eq(takes.id, takeId) });
  if (!take || take.projectId !== projectId)
    return NextResponse.json({ error: "take not found" }, { status: 404 });

  const [job] = await db.insert(analysisJobs).values({
    ownerId: session.user.id,
    takeId,
    status: "queued",
    result: { chain: ["loudnorm", "alimiter", "widen-light"], output: "Master preset" },
  }).returning();

  return NextResponse.json({
    jobId: job.id,
    chain: ["loudnorm", "alimiter", "widen-light"],
    status: "queued",
    output: "Master preset",
    parentTakeId: takeId,
  }, { status: 201 });
}
