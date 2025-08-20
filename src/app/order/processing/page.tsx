import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import ProcessingClient from "@/components/order/ProcessingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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