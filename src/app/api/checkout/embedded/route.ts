import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { priceId, qty = 1 } = await req.json();
  const stripe = getStripe();
  const urlBase = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const line_items = priceId
    ? [{ price: priceId, quantity: qty }]
    : [{
        price_data: {
          currency: "mxn",
          unit_amount: 10000, // $100 MXN demo
          product_data: { name: "Boleto de prueba" },
        },
        quantity: qty,
      }];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    ui_mode: "embedded",
    line_items,
    return_url: `${urlBase}/success?session_id={CHECKOUT_SESSION_ID}`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ client_secret: session.client_secret }, { status: 201 });
}