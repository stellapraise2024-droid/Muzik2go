import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
});

// POST /api/beats {projectId, fileName, contentType} → {url, key}
// Beat stored at instrumentals/{projectId}/{fileName}; vocal always recorded separately (never baked in MVP).
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, fileName, contentType } = await req.json();
  if (!projectId || !fileName) return NextResponse.json({ error: "projectId + fileName required" }, { status: 400 });
  const key = `instrumentals/${projectId}/${fileName}`;
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, ContentType: contentType ?? "audio/mpeg" }), { expiresIn: 600 });
  // TODO: update song_projects.instrumental_url = key after client PUT completes
  return NextResponse.json({ url, key, note: "5-min max, MP3/WAV/M4A; drift target <50ms" });
}
