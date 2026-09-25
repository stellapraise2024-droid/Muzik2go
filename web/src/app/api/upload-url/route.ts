import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
});

// POST /api/upload-url {projectId, takeId, contentType} → {url, key}
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { projectId, takeId, contentType } = await req.json();
  if (!projectId || !takeId) return NextResponse.json({ error: "projectId + takeId required" }, { status: 400 });
  // TODO: verify owner/collaborator for projectId before signing
  const key = `raw-takes/${projectId}/${takeId}.m4a`;
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, ContentType: contentType ?? "audio/m4a" }), { expiresIn: 600 });
  return NextResponse.json({ url, key });
}
