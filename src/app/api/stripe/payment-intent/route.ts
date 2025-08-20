import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const qty = Number(body?.qty ?? 1);
    const priceId = body?.priceId as string | undefined;
    let amount = Number(body?.amount ?? 0);
    let currency = (body?.currency as string | undefined) ?? "mxn";

    if (priceId) {
      const price = await stripe.prices.retrieve(priceId);
      if (!price.unit_amount || !price.currency) {
        return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
      }
      amount = price.unit_amount * qty;
      currency = price.currency;
    } else if (!amount || amount < 1) {
      // fallback demo: 100 MXN
      amount = 10000;
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        app: "reboot",
      },
    });

    return NextResponse.json({ clientSecret: intent.client_secret }, { status: 200 });
  } catch (err: any) {
    console.error("PI error", err);
    return NextResponse.json({ error: err?.message ?? "Error" }, { status: 500 });
  }
}