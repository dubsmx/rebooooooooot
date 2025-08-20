import { NextRequest, NextResponse } from "next/server";
import { presignPut } from "@/lib/r2";
import { FieldValue, db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { eventId, ext, contentType } = await req.json();
  if (!eventId || !ext) return NextResponse.json({ error: "Missing eventId/ext" }, { status: 400 });
  const key = `tickets/${eventId}/${crypto.randomUUID()}.${ext.replace(/^\./,"")}`;
  const { url } = await presignPut(key, contentType || "application/octet-stream");
  await db.collection("uploads").add({ key, eventId, createdAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ url, key });
}