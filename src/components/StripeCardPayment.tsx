"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

type Props = { listingId: string; amount: number; currency: "mxn" | "usd"; title: string; buyerEmail?: string };

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

async function verifyOrder(orderId: string): Promise<string> {
  try {
    const r = await fetch("/api/stripe/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
      cache: "no-store",
    });
    const d = await r.json();
    return d?.status || "unknown";
  } catch {
    return "unknown";
  }
}

function Form({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const r = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMsg(null);

    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });

    // Poll del backend para cubrir retraso de webhook / race PI
    for (let i = 0; i < 15; i++) {
      const st = await verifyOrder(orderId);
      if (st === "paid") { r.replace(`/order/${orderId}`); return; }
      if (st === "failed") { r.replace(`/order/failed?reason=${encodeURIComponent(error?.message || "Payment failed")}`); return; }
      await new Promise(d => setTimeout(d, 800));
    }

    setSubmitting(false);

    if (paymentIntent?.status === "succeeded") { r.replace(`/order/${orderId}`); return; }
    if (error) {
      setMsg(error.message || "Payment failed");
      r.replace(`/order/failed?reason=${encodeURIComponent(error.message || "Payment failed")}`);
      return;
    }
    r.replace(`/order/processing?orderId=${orderId}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement />
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <button disabled={!stripe || submitting} className="btn btn-primary w-full">
        {submitting ? "Processing…" : "Pay now (test)"}
      </button>
    </form>
  );
}

export default function StripeCardPayment({ listingId, buyerEmail }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // anti doble render
    startedRef.current = true;
    (async () => {
      try {
        const res = await fetch("/api/stripe/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, email: buyerEmail }),
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "create_intent_failed");
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
      } catch (e: any) {
        setErr(e?.message || "Failed to initialize payment");
      }
    })();
  }, [listingId, buyerEmail]);

  if (err) return <div className="text-sm text-red-400">{err}</div>;
  if (!clientSecret || !orderId) return <div className="text-sm opacity-60">Loading payment form…</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
      <Form orderId={orderId} />
    </Elements>
  );
}