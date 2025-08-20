import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { demoListings, demoEvents } from "@/mock/data";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!db) {
    const listing = demoListings.find(l => l.id === id);
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const event = demoEvents.find(e => e.id === listing.eventId);
    return NextResponse.json({ listing, event });
  }

  const ldoc = await db.collection("listings").doc(id).get();
  if (!ldoc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const listing = { id: ldoc.id, ...(ldoc.data() as any) };

  const edoc = await db.collection("events").doc(listing.eventId).get();
  const event = edoc.exists ? { id: edoc.id, ...(edoc.data() as any) } : null;

  return NextResponse.json({ listing, event });
}