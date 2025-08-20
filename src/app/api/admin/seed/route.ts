import { NextRequest, NextResponse } from "next/server";
import { admin, db } from "@/lib/firebaseAdmin";
import { demoEvents, demoListings } from "@/mock/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("confirm") !== "YES") {
    return NextResponse.json({ ok: false, error: "Add ?confirm=YES to run seeding." }, { status: 400 });
  }
  if (!db) {
    return NextResponse.json({ ok: false, error: "Admin DB not available (check GOOGLE_APPLICATION_CREDENTIALS_JSON)." }, { status: 500 });
  }

  let upE = 0, upL = 0;
  const batch = db.batch();

  // events
  for (const e of demoEvents) {
    const ref = db.collection("events").doc(e.id);
    const snap = await ref.get();
    if (!snap.exists) {
      batch.set(ref, {
        title: e.title,
        date: e.date,
        city: e.city,
        country: e.country,
        venue: e.venue,
        image: e.image,
        source: e.source ?? "seed",
        tmId: e.tmId ?? null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      upE++;
    }
  }

  // listings
  for (const l of demoListings) {
    const ref = db.collection("listings").doc(l.id);
    const snap = await ref.get();
    if (!snap.exists) {
      batch.set(ref, {
        sellerUid: l.sellerUid,
        eventId: l.eventId,
        price: l.price,
        currency: l.currency,
        status: l.status,
        storageKey: l.storageKey,
        fileType: l.fileType,
        qrMessage: l.qrMessage,
        section: l.section ?? null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      upL++;
    }
  }

  await batch.commit();
  return NextResponse.json({ ok: true, inserted: { events: upE, listings: upL } });
}