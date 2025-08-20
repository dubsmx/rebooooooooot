"use client";

export const dynamic = 'force-dynamic';
import { useCallback, useEffect, useState } from "react";
import TicketUpload from "@/components/TicketUpload";

export default function SellPage() {
  const [eventId, setEventId] = useState("");
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [verified, setVerified] = useState<{ storagePath: string; qrMessage: string; fileType: "pdf"|"pkpass" } | null>(null);
  const [price, setPrice] = useState<number>(1500);
  const [currency, setCurrency] = useState("MXN");
  const [submitting, setSubmitting] = useState(false);

  const search = useCallback(async () => {
    const res = await fetch(`/api/events/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
    const data = await res.json();
    setEvents(data.events);
  }, [query]);

  useEffect(() => { void search(); }, []); // initial

  const createListing = useCallback(async () => {
    if (!eventId || !verified) { alert("Select event and upload ticket first."); return; }
    setSubmitting(true);
    const res = await fetch("/api/listings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        price,
        currency,
        storageKey: verified.storagePath,
        fileType: verified.fileType,
        qrMessage: verified.qrMessage
      })
    });
    setSubmitting(false);
    if (!res.ok) alert(await res.text()); else alert("Listing created!");
  }, [currency, eventId, price, verified]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <section className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">How to sell on Boletera</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-neutral-700">
            <li>Choose the correct event.</li>
            <li>Upload your PDF or PKPASS.</li>
            <li>We read and verify the barcode.</li>
            <li>Set a fair price and publish.</li>
          </ol>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">How it works</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
            <li>Buyers pay via Mercado Pago (test mode).</li>
            <li>Once paid, the file is delivered and listing is marked sold.</li>
            <li>Keep your contact info updated in Profile.</li>
          </ul>
        </div>
      </section>

      <section className="border rounded p-4 space-y-4">
        <div className="font-medium">Select event</div>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 w-full" placeholder="Search events..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button onClick={search} className="border rounded px-3">Search</button>
        </div>
        <div className="max-h-60 overflow-auto border rounded">
          {events.map((e: any) => (
            <label key={e.id} className="flex items-center gap-2 px-3 py-2 border-b">
              <input type="radio" name="event" onChange={() => setEventId(e.id)} checked={eventId === e.id}/>
              <span className="text-sm">{e.title} â€” {e.city}, {e.country}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <TicketUpload eventId={eventId || "unassigned"} onVerified={setVerified} />
      </section>

      <section className="border rounded p-4 grid md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input type="number" className="border rounded px-3 py-2 w-full" value={price} onChange={(e) => setPrice(parseInt(e.target.value || "0"))}/>
        </div>
        <div>
          <label className="block text-sm mb-1">Currency</label>
          <select className="border rounded px-3 py-2 w-full" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option>MXN</option><option>USD</option>
          </select>
        </div>
        <button disabled={submitting} onClick={createListing} className="border rounded px-3 py-2">
          {submitting ? "Creating..." : "Create listing"}
        </button>
      </section>
    </div>
  );
}