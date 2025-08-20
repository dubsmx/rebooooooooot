import Link from "next/link";

export default async function OrderSuccess({ searchParams }: { searchParams: Promise<{ listingId?: string; paymentId?: string; status?: string }> }) {
  const { listingId, paymentId, status } = await searchParams;
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  let listing: any = null; let event: any = null;

  if (listingId) {
    const r = await fetch(`${base}/api/listings/${listingId}`, { cache: "no-store" });
    if (r.ok) { const j = await r.json(); listing = j.listing; event = j.event; }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold">Order confirmed</h1>
      <div className="text-sm text-[--muted]">Payment ID: {paymentId || "TEST-MOCK"}</div>

      <div className="card p-5 space-y-1">
        <div className="font-semibold">{event?.title ?? "Ticket"}</div>
        <div className="text-sm text-[--muted]">{event?.venue ? `${event.venue} · ` : ""}{event?.city}, {event?.country}</div>
        <div className="flex justify-between pt-2">
          <div>1 × Ticket</div>
          <div className="font-semibold">{listing ? Number(listing.price).toLocaleString("en-US") : "-"} {listing?.currency ?? "MXN"}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </main>
  );
}