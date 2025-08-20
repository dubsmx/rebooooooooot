"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function ProcessingClient() {
  const p = useSearchParams();
  const r = p.get("ref");
  return <p className="text-[#E5E5E5]">Procesando tu orden{r ? ` (${r})` : ""}…</p>;
}

export default function ProcessingPage() {
  return (
    <>
      <Navbar />
      <main className="section px-4 py-16">
        <h1 className="text-3xl mb-4">Checkout</h1>
        <Suspense fallback={<div className="text-[#E5E5E5]">Cargando…</div>}>
          <ProcessingClient />
        </Suspense>
      </main>
    </>
  );
}