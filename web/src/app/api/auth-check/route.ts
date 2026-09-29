import { NextRequest, NextResponse } from "next/server";

// POST /api/auth-check {email} → {exists: boolean}
// Phase: stub. Runtime: lookup Better Auth user by email → exists? open studio : show signup fields.
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  // TODO: db query users where email = lower(email)
  return NextResponse.json({ email, exists: false, next: "signup-fields" });
}
