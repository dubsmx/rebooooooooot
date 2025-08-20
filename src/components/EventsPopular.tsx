import EventCard from "./EventCard";

const PRICES = {
  OASIS: process.env.NEXT_PUBLIC_PRICE_OASIS ?? "",
  RELSB: process.env.NEXT_PUBLIC_PRICE_RELSB ?? "",
  TAYLOR: process.env.NEXT_PUBLIC_PRICE_TAYLOR ?? "",
};

const items = [
  { title:"Oasis — The Reunion Tour (Night 2)", city:"CDMX",      price:"$1,250.00", image:"/images/event-oasis.jpg",  priceId: PRICES.OASIS  },
  { title:"Rels B — Tour 2025",                 city:"CDMX",      price:"$890.00",   image:"/images/event-relsb.jpg", priceId: PRICES.RELSB  },
  { title:"Taylor Swift — The Eras",            city:"Monterrey", price:"$2,100.00", image:"/images/event-taylor.jpg",priceId: PRICES.TAYLOR },
];

export default function EventsPopular() {
  return (
    <section id="eventos" className="section mx-auto max-w-7xl px-4 py-14">
      <header className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold">Lo que todos están viviendo ahora</h2>
        <p className="text-muted mt-3">
          Explora los espectáculos más buscados y prepárate para ser parte de momentos inolvidables.
        </p>
      </header>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((e,i)=>(
          <EventCard key={i} {...e} href="#eventos" />
        ))}
      </div>
      <div className="mt-8">
        <a href="#eventos" className="btn btn-secondary">Ver todos los eventos</a>
      </div>
    </section>
  );
}