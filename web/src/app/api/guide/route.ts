import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/guide — Guide Me: next-best-action from projects + voice profile + recent analyses.
// e.g. "3 unfinished songs — continue My Love?", "Pitch improving — challenge with chorus", "Verse incomplete".
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({
    suggestions: [
      { id: "g1", text: "3 unfinished songs — continue My Love?", action: "open-project" },
      { id: "g2", text: "Pitch improving — challenge it with the chorus", action: "open-practice" },
    ],
  });
}
