"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyBar({
  label, unitAmount, available, currency = "MXN", priceId = "", defaultQty = 1,
}: { label: string; unitAmount: number; available: number; currency?: string; priceId?: string; defaultQty?: number; }) {
  const [qty, setQty] = useState(Math.max(1, defaultQty));
  const router = useRouter();
  const total = useMemo(() => unitAmount * qty, [unitAmount, qty]);
  const fmt = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  const goCheckout = () => {
    const q = new URLSearchParams({ qty: String(qty) });
    if (priceId) q.set("priceId", priceId);
    router.push(`/checkout?${q.toString()}`);
  };
  const soldOut = available <= 0;

  return (
    <div className="sticky top-[88px] z-30 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm">
          <span className="opacity-80">Seleccionado:</span>{" "}
          <span className="font-medium">{label}</span>{" "}
          <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-xs">
            {soldOut ? "Agotado" : `Disponibles: ${available}`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/15 px-2 py-1">
            <button className="px-2 py-1 text-sm opacity-80 hover:opacity-100"
                    onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={soldOut}>−</button>
            <span className="min-w-6 text-center text-sm">{qty}</span>
            <button className="px-2 py-1 text-sm opacity-80 hover:opacity-100"
                    onClick={() => setQty((q) => Math.min(available || 10, q + 1))} disabled={soldOut}>+</button>
          </div>

          <div className="text-sm">
            <span className="opacity-80">Total:</span>{" "}
            <span className="font-semibold">{fmt(total)} {currency.toUpperCase()==="MXN"?"":currency.toUpperCase()}</span>
          </div>

          <button onClick={goCheckout}
                  className="rounded-xl bg-white text-black px-3 py-2 text-sm disabled:opacity-50"
                  disabled={soldOut}>
            Ir a pagar
          </button>
        </div>
      </div>
    </div>
  );
}