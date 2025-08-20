import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, admin } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId missing" }, { status: 400 });

    const od = await db.collection("orders").doc(orderId).get();
    if (!od.exists) return NextResponse.json({ error: "order not found" }, { status: 404 });
    const order = od.data() as any;

    const piId = order?.stripePaymentIntentId;
    if (!piId) return NextResponse.json({ error: "missing payment intent" }, { status: 400 });
    const pi = await stripe.paymentIntents.retrieve(piId);

    if (pi.status === "succeeded") {
      await db.collection("orders").doc(orderId).update({
        status: "paid",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      if (order.listingId) {
        await db.collection("listings").doc(order.listingId).update({
          status: "sold",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      return NextResponse.json({ ok: true, status: "paid" });
    }

    if (pi.status === "requires_payment_method" || pi.status === "canceled") {
      await db.collection("orders").doc(orderId).update({
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return NextResponse.json({ ok: true, status: "failed" });
    }

    // pending / processing / requires_action
    return NextResponse.json({ ok: true, status: pi.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "verify_failed" }, { status: 500 });
  }
}