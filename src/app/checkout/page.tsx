"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function CheckoutClient() {
  const search = useSearchParams();
  const priceId = search.get("priceId") ?? "";
  const qty = Number(search.get("qty") ?? "1");
  const [msg, setMsg] = useState("Preparando tu pago…");

  useEffect(() => {
    (async () => {
      try {
        if (!priceId) { setMsg("Falta priceId"); return; }
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ priceId, quantity: qty }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "No se pudo crear la sesión");

        const { id } = await res.json();
        const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
        const stripe = await loadStripe(pk);
        if (!stripe) throw new Error("Stripe no cargó en el navegador");

        const { error } = await stripe.redirectToCheckout({ sessionId: id });
        if (error) setMsg(error.message || "Error al redirigir a Stripe");
      } catch (err: any) {
        setMsg(err.message || "Error creando la sesión de pago");
      }
    })();
  }, [priceId, qty]);

  return <p className="text-[#E5E5E5]">{msg}</p>;
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="section px-4 py-16">
        <h1 className="text-3xl mb-4">Checkout</h1>
        <Suspense fallback={<div className="text-[#E5E5E5]">Cargando…</div>}>
          <CheckoutClient />
        </Suspense>
      </main>
    </>
  );
}