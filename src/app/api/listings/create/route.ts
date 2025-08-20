import { NextRequest, NextResponse } from "next/server";
import { FieldValue, db } from "@/lib/firebaseAdmin";
import { z } from "zod";

const bodySchema = z.object({
  eventId: z.string().min(1),
  price: z.number().int().positive(),
  currency: z.enum(["MXN","USD","EUR"]).default("MXN"),
  storageKey: z.string().min(1),
  fileType: z.enum(["pdf","pkpass"]),
  qrMessage: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const id = db.collection("listings").doc().id;
  await db.collection("listings").doc(id).set({
    ...parsed.data,
    sellerUid: "demo-seller",
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  return NextResponse.json({ id });
}