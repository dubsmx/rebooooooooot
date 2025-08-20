"use client";

import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";

function Form() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const returnUrl = `${window.location.origin}/success`;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (error) setError(error.message ?? "No se pudo confirmar el pago.");
    setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg w-full">
      <div className="rounded-xl border border-white/10 p-4 bg-black">
        <PaymentElement />
      </div>
      {error && <p className="text-red-400 mt-3">{error}</p>}
      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={submitting || !stripe} className="btn btn-primary h-10 px-4 rounded-lg disabled:opacity-50">
          {submitting ? "Procesando…" : "Pagar"}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutClient() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Obtén parámetros (priceId, qty) del query si existen
    const url = new URL(window.location.href);
    const priceId = url.searchParams.get("priceId");
    const qty = Number(url.searchParams.get("qty") ?? "1");

    fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, qty }),
    })
      .then((r) => r.json())
      .then((d) => setClientSecret(d.clientSecret))
      .catch(() => setClientSecret(null));
  }, []);

  const options = useMemo(() => ({
    clientSecret: clientSecret ?? undefined,
    appearance: {
      theme: "night",
      variables: { colorText: "#ffffff", colorPrimary: "#ffffff" },
      labels: "floating"
    } as any,
  }), [clientSecret]);

  if (!clientSecret) {
    return <p className="section px-4 py-10">Sesión: Preparando tu pago…</p>;
  }

  return (
    <div className="section px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <Elements stripe={stripePromise} options={options}>
        <Form />
      </Elements>
    </div>
  );
}