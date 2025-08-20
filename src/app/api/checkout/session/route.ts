import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { priceId, qty = 1 } = await req.json();

    const stripe = getStripe();
    const urlBase = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const line_items = priceId
      ? [{ price: priceId, quantity: qty }]
      : [{
          price_data: {
            currency: "mxn",
            unit_amount: 10000, // $100 MXN de prueba
            product_data: { name: "Boleto de prueba" },
          },
          quantity: qty,
        }];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${urlBase}/?status=success`,
      cancel_url: `${urlBase}/?status=cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}