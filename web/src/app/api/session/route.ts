import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { songProjects, practiceSessions } from "@/lib/schema";
import { eq } from "drizzle-orm";

const STEPS = ["prepare", "warmup", "practice", "record", "analyze", "retry", "compare", "develop", "save"];

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, goal } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const project = await db.query.songProjects.findFirst({
    where: eq(songProjects.id, projectId as string),
  });
  if (!project || project.ownerId !== session.user.id)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const [practice] = await db.insert(practiceSessions).values({
    ownerId: session.user.id,
    projectId,
    exercise: "studio-session",
    notes: goal || "",
  }).returning();

  return NextResponse.json({
    sessionId: practice.id,
    projectId,
    goal: goal ?? "",
    steps: STEPS,
    currentStep: 0,
    exitable: true,
  }, { status: 201 });
}
