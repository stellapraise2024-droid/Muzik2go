import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { feedback } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.message) return NextResponse.json({ error: "message required" }, { status: 400 });
  if (!body?.kind) return NextResponse.json({ error: "kind required" }, { status: 400 });

  let ownerId: string | null = null;
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth.api.getSession({ headers: req.headers });
    if (session) ownerId = session.user.id;
  } catch {}

  const [row] = await db.insert(feedback).values({
    ownerId,
    kind: body.kind,
    message: body.message.slice(0, 2000),
    meta: body.meta || {},
  }).returning();

  return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
}
