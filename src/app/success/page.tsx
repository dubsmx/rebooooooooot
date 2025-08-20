import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getStripe } from "@/lib/stripe";

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const id = searchParams?.session_id;
  const stripe = getStripe();
  const session = id ? await stripe.checkout.sessions.retrieve(id, { expand: ["line_items.data.price.product"] }) : null;

  return (
    <>
      <Navbar />
      <main className="section mx-auto max-w-2xl px-4 pt-24 pb-16">
        <h1 className="text-2xl font-semibold">¡Pago confirmado!</h1>
        {session ? (
          <>
            <p className="mt-2 text-muted">Orden <span className="opacity-80">{session.id}</span></p>
            <div className="card p-4 mt-6">
              <h2 className="font-medium mb-2">Resumen</h2>
              <ul className="space-y-2 text-sm">
                {session.line_items?.data.map((li:any, i:number)=>(
                  <li key={i} className="flex justify-between">
                    <span>{li.description ?? li.price?.product?.name ?? "Boleto"}</span>
                    <span>{li.quantity} × {(li.amount_total/100).toLocaleString("es-MX",{style:"currency",currency:(session.currency||"mxn").toUpperCase()})}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-[#1A1A1A] pt-3">
                <span>Total</span>
                <span className="font-semibold">
                  {(session.amount_total!/100).toLocaleString("es-MX",{style:"currency",currency:(session.currency||"mxn").toUpperCase()})}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-2 text-muted">No se recibió el ID de sesión.</p>
        )}
        <Link href="/" className="mt-8 inline-block btn btn-secondary">Volver al inicio</Link>
      </main>
    </>
  );
}