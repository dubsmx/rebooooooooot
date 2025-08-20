import Image from "next/image";

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const r = await fetch(`${base}/api/orders/${orderId}`, { cache: "no-store" });
  if (!r.ok) {
    return <div className="container max-w-3xl mx-auto p-6"><h1 className="text-xl font-semibold">Order not found</h1></div>;
  }
  const { order, listing } = await r.json() as any;
  return (
    <div className="container max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Order</h1>
      <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-4">
        <div className="flex items-center justify-between">
          <div className="opacity-70 text-sm">Order ID</div>
          <div className="font-mono text-sm">{order.id}</div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="opacity-70 text-sm">Status</div>
          <div className="font-semibold capitalize">{order.status}</div>
        </div>
      </div>
      {listing && (
        <div className="rounded-xl border border-white/10 bg-neutral-950/60 p-4">
          <div className="font-medium mb-2">Listing</div>
          <div className="flex items-center justify-between text-sm">
            <div>Listing ID</div><div className="font-mono">{listing.id}</div>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <div>Price</div><div className="font-semibold">
              {new Intl.NumberFormat("es-MX", { style: "currency", currency: listing.currency || "MXN" }).format(listing.price)}
            </div>
          </div>
          {listing.section && <div className="text-sm mt-1">Section: {listing.section}</div>}
        </div>
      )}
      {order.status === "paid" && listing?.storageKey && (
        <a className="btn btn-primary" href={process.env.NEXT_PUBLIC_R2_PUBLIC_BASE + "/" + listing.storageKey} target="_blank">
          Download ticket
        </a>
      )}
    </div>
  );
}