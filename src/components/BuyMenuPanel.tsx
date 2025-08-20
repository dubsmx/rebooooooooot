"use client";

import { useMemo, useState } from "react";

type Listing = {
  id: string;
  price: number;
  currency: string;
  status: "active"|"sold"|"removed";
  section?: string | null;
};

type EventInfo = {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  image: string;
};

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-full text-xs border bg-neutral-50">{children}</span>;
}

function Row({
  label, sub, count, onClick, active
}: { label: string; sub?: string; count: number; onClick?: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"w-full flex items-center justify-between rounded-lg px-3 py-2 border text-left transition " +
        (active ? "bg-neutral-100 border-neutral-300" : "hover:bg-neutral-50")}
    >
      <div>
        <div className="font-medium">{label}</div>
        {sub ? <div className="text-xs text-neutral-600">{sub}</div> : null}
      </div>
      <Badge>{count}</Badge>
    </button>
  );
}

export default function BuyMenuPanel({
  event, listings
}: { event: EventInfo; listings: Listing[] }) {
  const [alerts, setAlerts] = useState(true);
  const [filter, setFilter] = useState<string>("__all__");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeListings = useMemo(() => listings.filter(l => l.status === "active"), [listings]);

  const sections = useMemo(() => {
    const groups = new Map<string, number>();
    for (const l of activeListings) {
      const key = (l.section && l.section.trim()) ? l.section.trim() : "General admission";
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    return Array.from(groups.entries()).sort((a,b) => a[0].localeCompare(b[0]));
  }, [activeListings]);

  const filtered = useMemo(() => {
    const arr = filter === "__all__" ? activeListings : activeListings.filter(l => (l.section || "General admission") === filter);
    return arr.slice().sort((a,b) => a.price - b.price);
  }, [activeListings, filter]);

  async function buy(listingId: string) {
    setBusy(listingId); setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(`${base}/api/mp/create-preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create preference");
      const url = data?.init_point;
      if (typeof window !== "undefined" && url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 border-b">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.image} alt={event.title} className="size-14 rounded-md object-cover border" />
          <div className="min-w-0">
            <div className="text-xs text-neutral-500">Multiple dates</div>
            <h3 className="text-xl font-bold leading-tight truncate">{event.title}</h3>
            <div className="text-sm text-neutral-700">
              {event.venue} · {event.city}, {event.country}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5 grid md:grid-cols-3 gap-4">
        {/* Filtros */}
        <div className="md:col-span-1 space-y-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Ticket alerts</div>
                <div className="text-xs text-neutral-600">Get notified when new tickets appear.</div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="peer sr-only" checked={alerts} onChange={() => setAlerts(!alerts)} />
                <span className="w-10 h-6 bg-neutral-300 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:size-5 after:bg-white after:rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-4 transition"></span>
              </label>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium mb-2">Ticket types</div>
            <div className="space-y-2">
              <Row label="All tickets" sub="All sections" count={activeListings.length} active={filter === "__all__"} onClick={() => setFilter("__all__")} />
              {sections.map(([name, count]) => (
                <Row key={name} label={name} sub="Multiple dates" count={count} active={filter === name} onClick={() => setFilter(name)} />
              ))}
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Available tickets</div>
            <div className="text-xs text-neutral-500">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div>
          </div>

          {error ? <div className="mb-2 text-sm text-red-600">{error}</div> : null}

          <div className="space-y-2">
            {filtered.map(l => (
              <div key={l.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{l.section || "General admission"}</div>
                  <div className="text-xs text-neutral-600">Status: {l.status}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">{l.price} {l.currency}</div>
                    <div className="text-xs text-neutral-600">per ticket</div>
                  </div>
                  <button
                    disabled={busy === l.id}
                    onClick={() => buy(l.id)}
                    className={"rounded-md border px-3 py-1.5 text-sm " + (busy === l.id ? "opacity-60" : "hover:bg-neutral-50")}
                  >
                    {busy === l.id ? "Processing…" : "Select"}
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-neutral-600 border rounded-lg px-3 py-6 text-center">
                No tickets available for this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}