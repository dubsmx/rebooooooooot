import Image from "next/image";
import StripeCardPayment from "@/components/StripeCardPayment";

export default async function BuyPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Esperamos que exista esta ruta en tu proyecto. Si no, cámbiala a tu fuente de datos.
  const r = await fetch(`${base}/api/listings/${listingId}`, { cache: "no-store" });
  if (!r.ok) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Listing not found</h1>
      </div>
    );
  }
  const data = await r.json() as {
    listing: { id: string; price: number; currency: string; section?: string; status: string };
    event?: { id: string; title: string; date?: string; city?: string; country?: string; venue?: string; image?: string };
  };

  const listing = data.listing;
  const event = data.event || { title: "Event", image: "/event.jpg" };

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-6">
      <div className="grid md:grid-cols-[1.5fr,1fr] gap-6">
        <div className="space-y-3">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={event.image || "/event.jpg"} alt={event.title} fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          <p className="text-sm opacity-75">{[event.venue, event.city, event.country].filter(Boolean).join(" • ")}</p>
          <div className="rounded-xl bg-neutral-900/40 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-75">Section</div>
              <div className="font-medium">{listing.section || "General"}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm opacity-75">Price</div>
              <div className="font-semibold">{new Intl.NumberFormat("es-MX", { style: "currency", currency: listing.currency || "MXN" }).format(listing.price)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-950/60 border border-white/10 p-5">
          <h2 className="text-lg font-semibold mb-3">Checkout</h2>
          <StripeCardPayment
            listingId={listingId}
            amount={listing.price}
            currency={(listing.currency || "MXN").toLowerCase() as "mxn"|"usd"}
            title={event.title}
          />
          <p className="mt-3 text-xs opacity-70">
            Use Stripe test cards. Example: 4242 4242 4242 4242 — CVC 123 — any future date.
          </p>
        </div>
      </div>
    </div>
  );
}