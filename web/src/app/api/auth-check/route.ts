import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const result = await db.execute(
    sql`SELECT id FROM "user" WHERE lower(email) = lower(${email}) LIMIT 1`,
  );
  const exists = (result as unknown as { rows: unknown[] }).rows.length > 0;

  return NextResponse.json({
    email,
    exists,
    next: exists ? "password" : "signup-fields",
  });
}
