import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { demoEvents, demoListings } from "@/mock/data";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!db) {
    const e = demoEvents.find(ev => ev.id === id);
    if (!e) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const listings = demoListings.filter(l => l.eventId === e.id && l.status === "active");
    return NextResponse.json({ event: e, availability: listings.length, listings });
  }

  try {
    const doc = await db.collection("events").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const event = { id: doc.id, ...(doc.data() as any) };
    const lsSnap = await db.collection("listings")
      .where("status","==","active")
      .where("eventId","==", id)
      .get();
    const listings = lsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json({ event, availability: listings.length, listings });
  } catch (err) {
    console.error("[events/[id]] error:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}