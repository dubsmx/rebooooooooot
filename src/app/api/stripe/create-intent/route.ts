import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, admin } from "@/lib/firebaseAdmin";

type Body = { listingId: string; email?: string };

export async function POST(req: NextRequest) {
  try {
    const { listingId, email } = (await req.json()) as Body;
    if (!listingId) return NextResponse.json({ error: "listingId missing" }, { status: 400 });

    const listingDoc = await db.collection("listings").doc(listingId).get();
    if (!listingDoc.exists) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    const listing = listingDoc.data() as any;
    if (listing.status !== "active") return NextResponse.json({ error: "Listing not active" }, { status: 400 });

    const amount = Math.round(Number(listing.price) * 100); // MXN cents
    const currency = (listing.currency || "mxn").toLowerCase();

    // Buscar orden pending reciente para este listing (idempotencia simple)
    const since = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 10)); // 10 min
    const pendingSnap = await db.collection("orders")
      .where("listingId", "==", listingId)
      .where("status", "==", "pending")
      .where("createdAt", ">=", since)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!pendingSnap.empty) {
      const od = pendingSnap.docs[0];
      const order = od.data() as any;
      if (order.stripePaymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
        if (pi.status !== "canceled") {
          return NextResponse.json({ clientSecret: pi.client_secret, orderId: od.id });
        }
      }
    }

    // Crear nuevo PaymentIntent
    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: { listingId, env: process.env.NODE_ENV || "development" },
    });

    const orderRef = db.collection("orders").doc();
    await orderRef.set({
      buyerUid: null,
      buyerEmail: email || null,
      listingId,
      eventId: listing.eventId || null,
      stripePaymentIntentId: pi.id,
      status: "pending",
      mpPreferenceId: null,
      mpPaymentId: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ clientSecret: pi.client_secret, orderId: orderRef.id });
  } catch (e: any) {
    console.error("[stripe/create-intent] error", e);
    return NextResponse.json({ error: e?.message || "create_intent_failed" }, { status: 500 });
  }
}