"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function CheckoutClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") || "";
  // TODO: aquí va tu UI real de checkout embebido
  return (
    <div className="section px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <p className="text-muted">Sesión: {sessionId || "Preparando tu pago…"}</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="section px-4 py-10">Cargando…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}