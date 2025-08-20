"use client";
import { useRouter } from "next/navigation";
export default function BuyButton({ priceId, qty = 1, label = "Comprar" }:{ priceId?: string; qty?: number; label?: string; }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        const q = new URLSearchParams({ qty: String(qty) });
        if (priceId) q.set("priceId", priceId);
        router.push(`/checkout?${q.toString()}`);
      }}
      className="btn btn-primary"
    >
      {label}
    </button>
  );
}