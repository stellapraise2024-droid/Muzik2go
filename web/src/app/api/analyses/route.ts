import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analysisJobs, aiAnalyses, takes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { takeId, projectId } = await req.json();
  if (!takeId || !projectId) return NextResponse.json({ error: "takeId + projectId required" }, { status: 400 });

  const take = await db.query.takes.findFirst({ where: eq(takes.id, takeId) });
  if (!take || take.projectId !== projectId)
    return NextResponse.json({ error: "take not found" }, { status: 404 });

  const [job] = await db.insert(analysisJobs).values({
    ownerId: session.user.id,
    takeId,
    status: "queued",
  }).returning();

  return NextResponse.json({ jobId: job.id, status: "queued", slaSec: 30 }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const takeId = new URL(req.url).searchParams.get("takeId");
  if (!takeId) return NextResponse.json({ error: "takeId required" }, { status: 400 });

  const analysis = await db.query.aiAnalyses.findFirst({
    where: eq(aiAnalyses.takeId, takeId as string),
  });

  if (analysis) {
    return NextResponse.json({
      takeId,
      kind: analysis.kind,
      content: analysis.content,
      createdAt: analysis.createdAt,
    });
  }

  const job = await db.query.analysisJobs.findFirst({
    where: eq(analysisJobs.takeId, takeId as string),
  });

  if (job && job.status === "completed" && job.result) {
    return NextResponse.json({
      takeId,
      kind: "analysis",
      content: job.result,
      createdAt: job.completedAt,
    });
  }

  return NextResponse.json({
    takeId,
    status: job?.status || "not_found",
    message: job?.status === "queued" ? "Analysis in progress — check back soon" : "No analysis found for this take",
  });
}
