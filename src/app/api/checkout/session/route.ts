import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeKey = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

function baseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL!;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    const fallbackPrice =
      process.env.NEXT_PUBLIC_PRICE_OASIS ||
      process.env.NEXT_PUBLIC_PRICE_RELSB ||
      process.env.NEXT_PUBLIC_PRICE_TAYLOR ||
      "";

    const priceId = String(payload.priceId || fallbackPrice);
    const quantity = Math.max(1, Number(payload.quantity ?? 1));
    if (!stripeKey) {
      return NextResponse.json({ error: "Falta STRIPE_SECRET_KEY en el servidor (Vercel)" }, { status: 500 });
    }
    if (!priceId) {
      return NextResponse.json({ error: "Sin priceId. Pasa ?priceId=... o configura NEXT_PUBLIC_PRICE_* en Vercel" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      success_url: `${baseUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/?canceled=1`,
      metadata: { env: process.env.NODE_ENV || "unknown" },
    });

    return NextResponse.json({ id: session.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Stripe error" }, { status: 500 });
  }
}