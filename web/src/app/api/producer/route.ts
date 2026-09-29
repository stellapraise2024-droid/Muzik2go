import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/producer {projectId, takeId?, brief} → 3 directions (Groq).
// AI Producer: musical direction, arrangement, song ideas. Artist picks — never auto-applies.
// Honors: "Don't change my song. Just show me what else it could become."
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, brief } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  // TODO: Groq via web/src/lib/groq.ts with arrangement context (structure + instrumental_url)
  return NextResponse.json({
    projectId, brief: brief ?? "",
    directions: [
      { id: "d1", title: "Stripped intimate", arrangement: "piano + vocal, sparse chorus" },
      { id: "d2", title: "Driving afro-fusion", arrangement: "log drums, call-response ad-libs" },
      { id: "d3", title: "Cinematic lift", arrangement: "strings pad into final chorus" },
    ],
  });
}
