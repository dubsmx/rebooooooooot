import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { demoEvents, demoListings } from "@/mock/data";

function mockResponse(country: string, city: string, q: string, limit: number) {
  let events = demoEvents.filter(e =>
    (!country || e.country === country) &&
    (!city || e.city === city)
  );
  if (q) events = events.filter(e => String(e.title || "").toLowerCase().includes(q.toLowerCase()));
  events = events.slice(0, limit);
  const availability = Object.fromEntries(events.map(e => [
    e.id,
    demoListings.filter(l => l.eventId === e.id && l.status === "active").length
  ]));
  return NextResponse.json({ events, availability });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? (process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? "Mexico");
  const city = searchParams.get("city") ?? (process.env.NEXT_PUBLIC_DEFAULT_CITY ?? "Mexico City");
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? 50);

  if (!db) return mockResponse(country, city, q, limit);

  try {
    let ref: FirebaseFirestore.Query = db.collection("events").where("country", "==", country);
    if (city) ref = ref.where("city", "==", city);
    const snap = await ref.limit(limit).get();
    let events = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any[];
    if (q) events = events.filter(e => String(e.title || "").toLowerCase().includes(q.toLowerCase()));

    // si no hay eventos en Firestore, usa mock (para no dejar vacío)
    if (events.length === 0) return mockResponse(country, city, q, limit);

    // availability por chunks
    const ids = events.map(e => e.id);
    const availability: Record<string, number> = Object.fromEntries(ids.map(id => [id, 0]));
    for (let i = 0; i < ids.length; i += 10) {
      const chunk = ids.slice(i, i + 10);
      const ls = await db.collection("listings").where("status", "==", "active").where("eventId", "in", chunk).get();
      ls.docs.forEach(doc => {
        const { eventId } = doc.data() as any;
        availability[eventId] = (availability[eventId] ?? 0) + 1;
      });
    }

    return NextResponse.json({ events, availability });
  } catch (err) {
    console.warn("[events/search] falling back to mock due to error:", err);
    return mockResponse(country, city, q, limit);
  }
}