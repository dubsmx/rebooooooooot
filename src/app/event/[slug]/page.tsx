import Navbar from "@/components/Navbar";
import BuyBar from "@/components/BuyBar";
import { bySlug } from "@/data/events";
import { notFound } from "next/navigation";

export default function EventPage({ params }: { params: { slug: string } }) {
  const e = (bySlug as any)[params.slug];
  if (!e) return notFound();

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="relative mx-auto max-w-7xl px-4">
          <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10"
               style={{
                 height: "min(62vh, 560px)",
                 backgroundImage: `url('${e.img}')`,
                 backgroundSize: "cover",
                 backgroundPosition: "center",
               }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
            <div className="absolute inset-0 flex items-end">
              <div className="p-6 md:p-10">
                <h1 className="text-3xl md:text-5xl font-semibold">{e.title}</h1>
                <p className="mt-2 text-neutral-200">{e.city} • {e.date}</p>
              </div>
            </div>
          </div>
        </section>

        <BuyBar label={e.title} unitAmount={e.priceMXN} available={e.available} priceId={e.priceId} />
        <div id="login" className="h-1" />
      </main>
    </>
  );
}