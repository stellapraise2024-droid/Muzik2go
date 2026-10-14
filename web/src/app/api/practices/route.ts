import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { practiceSessions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rows = await db.select().from(practiceSessions)
    .where(eq(practiceSessions.ownerId, session.user.id))
    .orderBy(desc(practiceSessions.createdAt));

  const totalSessions = rows.length;
  const totalSec = rows.reduce((acc, r) => acc + (r.durationSec || 0), 0);

  const daySet = new Set<string>();
  for (const r of rows) {
    daySet.add(r.createdAt.toISOString().slice(0, 10));
  }

  let streakDays = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (daySet.has(key)) streakDays++;
    else if (i > 0) break;
  }

  return NextResponse.json({
    sessions: rows.slice(0, 5),
    totalSessions,
    totalPracticeSec: totalSec,
    streakDays,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body?.exercise) return NextResponse.json({ error: "exercise required" }, { status: 400 });

  const [row] = await db.insert(practiceSessions).values({
    ownerId: session.user.id,
    projectId: body.projectId || null,
    exercise: body.exercise,
    durationSec: body.durationSec || 0,
    bpm: body.bpm || null,
    notes: body.notes || "",
  }).returning();

  return NextResponse.json({ session: row }, { status: 201 });
}
