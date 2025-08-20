import { NextRequest, NextResponse } from "next/server";
import { FieldValue, db, hasAdmin } from "@/lib/firebaseAdmin";

const CLABE_RE = /^\d{18}$/;

export async function GET() {
  if (!hasAdmin) {
    // Fallback sin Firestore: perfil vacío para UI
    return NextResponse.json({ profile: {} });
  }
  const uid = "demo-seller";
  const doc = await db.collection("users").doc(uid).get();
  return NextResponse.json({ profile: doc.exists ? doc.data() : {} });
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (data.clabe && !CLABE_RE.test(String(data.clabe))) {
    return NextResponse.json({ error: "CLABE must be exactly 18 digits" }, { status: 400 });
  }

  if (!hasAdmin) {
    // Fallback sin Firestore: validar y responder ok, sin persistir
    return NextResponse.json({ ok: true, note: "No Firestore Admin configured; not persisted." });
  }

  const uid = "demo-seller";
  await db.collection("users").doc(uid).set({
    displayName: data.displayName ?? "",
    phone: data.phone ?? "",
    rfc: data.rfc ?? "",
    curp: data.curp ?? "",
    clabe: data.clabe ?? "",
    avatarKey: data.avatarKey ?? null,
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return NextResponse.json({ ok: true });
}