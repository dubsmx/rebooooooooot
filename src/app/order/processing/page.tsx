"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function ProcessingClient() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") || sp.get("order_id") || sp.get("id") || sp.get("session_id") || "";

  return (
    <div className="section px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">Procesando tu orden</h1>
      <p className="text-muted">
        {orderId ? `ID: ${orderId}` : "Un momento, por favor…"}
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="section px-4 py-12">Procesando…</div>}>
      <ProcessingClient />
    </Suspense>
  );
}