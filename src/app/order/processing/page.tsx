"use client";

export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProcessingPage() {
  const sp = useSearchParams();
  const r = useRouter();
  const orderId = sp.get("orderId") || "";

  const [msg, setMsg] = useState("Confirming your paymentâ€¦");
  useEffect(() => {
    if (!orderId) return;
    let stop = false;
    (async () => {
      // poll up to ~20s
      for (let i = 0; i < 20 && !stop; i++) {
        try {
          const res = await fetch("/api/stripe/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });
          const data = await res.json();
          const status = data?.status;
          if (status === "paid") { r.replace(`/order/${orderId}`); return; }
          if (status === "failed") { r.replace(`/order/failed?reason=Payment%20failed`); return; }
          setMsg(`Waitingâ€¦ (${status || "pending"})`);
        } catch {}
        await new Promise((d) => setTimeout(d, 1000));
      }
      r.replace(`/order/${orderId}`);
    })();
    return () => { stop = true; };
  }, [orderId, r]);

  return (
    <div className="container max-w-md mx-auto p-6 text-center">
      <h1 className="text-xl font-semibold mb-2">Processing</h1>
      <p className="opacity-70">{msg}</p>
    </div>
  );
}