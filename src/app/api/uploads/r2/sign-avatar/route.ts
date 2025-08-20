import { NextRequest, NextResponse } from "next/server";
import { presignPut } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const { ext, contentType } = await req.json();
  const key = `avatars/${crypto.randomUUID()}.${(ext || "png").replace(/^\./,"")}`;
  const { url } = await presignPut(key, contentType || "image/png");
  return NextResponse.json({ url, key });
}