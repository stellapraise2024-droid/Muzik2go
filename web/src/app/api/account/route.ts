import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// DELETE /api/account — purge user: projects + takes (R2 keys) + analyses + sessions + auth user.
// Privacy audit: Private-by-default; explicit AI consent string; delete purges audio + analyses.
export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // TODO: delete R2 objects (raw-takes/{userProjects}/*, processed/*), drizzle cascades, better-auth user delete
  return NextResponse.json({ ok: true, purged: "stub — wire R2 + drizzle in runtime" });
}
