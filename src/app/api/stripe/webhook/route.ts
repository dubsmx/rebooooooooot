import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, admin } from "@/lib/firebaseAdmin";

export const runtime = "nodejs"; // necesitamos stream raw

export async function POST(req: NextRequest) {
  const sig = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });

  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig as string, secret);
  } catch (err: any) {
    console.error("[stripe/webhook] signature error", err?.message);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as any; // Stripe.PaymentIntent
      const piId = pi.id as string;

      // Busca la orden por paymentIntentId
      const qs = await db.collection("orders").where("stripePaymentIntentId", "==", piId).limit(1).get();
      if (!qs.empty) {
        const od = qs.docs[0];
        const status = event.type === "payment_intent.succeeded" ? "paid" : "failed";
        await od.ref.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

        const o = od.data() as any;
        if (status === "paid" && o.listingId) {
          await db.collection("listings").doc(o.listingId).update({
            status: "sold",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }
  } catch (e: any) {
    console.error("[stripe/webhook] handler error", e?.message);
    return NextResponse.json({ received: true, warn: e?.message }, { status: 200 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}