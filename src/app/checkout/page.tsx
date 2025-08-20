"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
  const search = useSearchParams();
  const priceId = search.get("priceId") || "";
  const qty = Number(search.get("qty") || "1");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/checkout/embedded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, qty }),
      });
      const data = await res.json();
      setClientSecret(data.client_secret ?? null);
    })();
  }, [priceId, qty]);

  useEffect(() => {
    if (!clientSecret) return;
    (async () => {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) return;
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
      checkout.mount("#checkout");
    })();
  }, [clientSecret]);

  return (
    <>
      <Navbar />
      <main className="section mx-auto max-w-5xl px-4 pt-24 pb-16">
        <h1 className="text-2xl font-semibold mb-4">Completa tu compra</h1>
        <div id="checkout" className="rounded-2xl border border-[#1A1A1A] p-0 overflow-hidden" />
      </main>
    </>
  );
}