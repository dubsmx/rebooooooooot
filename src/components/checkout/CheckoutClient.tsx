"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const FALLBACK_PRICE =
  process.env.NEXT_PUBLIC_PRICE_OASIS ||
  process.env.NEXT_PUBLIC_PRICE_RELSB ||
  process.env.NEXT_PUBLIC_PRICE_TAYLOR ||
  "";

export default function CheckoutClient() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Preparando tu pago…");

  const priceId = params.get("priceId") ?? FALLBACK_PRICE;
  const qty = Math.max(1, Number(params.get("qty") ?? "1"));
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

  const start = useCallback(async () => {
    try {
      if (!pk) { setStatus("Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en Vercel."); return; }
      if (!priceId) { setStatus("Falta priceId. Añádelo a la URL o configura NEXT_PUBLIC_PRICE_* en Vercel."); return; }
      setLoading(true);

      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ priceId, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo crear la sesión");

      const stripe = await loadStripe(pk);
      if (!stripe) throw new Error("Stripe no cargó (pk inválida)");
      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) throw error;
    } catch (err: any) {
      setStatus(err.message || "Error al redirigir a Stripe");
      setLoading(false);
    }
  }, [pk, priceId, qty]);

  useEffect(() => { start(); }, [start]);

  return (
    <div className="space-y-4">
      <p className="text-[#E5E5E5]">{status}</p>
      {!loading && (
        <button onClick={start} className="btn btn-primary">Pagar ahora</button>
      )}
      <p className="text-xs text-[#9a9a9a]">Si no avanza, revisa variables de entorno en Vercel.</p>
    </div>
  );
}