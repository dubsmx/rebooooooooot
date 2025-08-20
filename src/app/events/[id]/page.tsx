import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });

  if (!res.ok) return notFound();
  const { event, listings } = await res.json() as {
    event: { id: string; title: string; date: string; venue: string; city: string; country: string; image: string };
    listings: Array<{ id: string; price: number; currency: string; status: string; section?: string }>;
    availability: number;
  };

  const dt = new Date(event.date);
  const when = dt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Banner/Hero */}
      <section className="relative h-72 md:h-96 rounded-3xl overflow-hidden">
        <Image src={event.image} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute left-6 bottom-6 text-white space-y-1">
          <div className="text-sm opacity-85">{when} · {event.venue} · {event.city}, {event.country}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{event.title}</h1>
        </div>
      </section>

      {/* Panel de compra SIEMPRE visible (no modal, no dynamic, no redirects) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="card p-5">
            <h2 className="font-semibold text-lg mb-2">Ticket types</h2>
            <div className="text-sm text-[--muted]">Select a section on the right to continue.</div>
          </div>
        </div>

        <aside className="card p-5 space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Available tickets</h2>
            <div className="text-sm text-[--muted]">{listings?.length ?? 0} results</div>
          </div>

          {(!listings || listings.length === 0) && (
            <div className="text-[--muted] text-sm">No active listings for this event.</div>
          )}

          {listings?.map((l) => (
            <div key={l.id} className="flex items-center justify-between rounded-2xl border border-[--border] bg-[--surface] p-4">
              <div>
                <div className="font-medium">{l.section || "General"}</div>
                <div className="text-xs text-[--muted]">Status: {l.status}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{Number(l.price).toLocaleString("en-US")} {l.currency}</div>
                <Link href={`/buy/${l.id}`} className="btn-primary mt-2 inline-block">Buy now</Link>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}