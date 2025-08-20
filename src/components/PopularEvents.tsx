type EventCard = { img: string; title: string; city: string; price: string; };
const sample: EventCard[] = [
  { img: "/images/event-1.jpg", title: "Oasis — The Reunion Tour (Night 2)", city: "CDMX", price: "desde $1,250" },
  { img: "/images/event-2.jpg", title: "Rels B — Tour 2025", city: "CDMX", price: "desde $890" },
  { img: "/images/event-3.jpg", title: "Taylor Swift — The Eras", city: "Monterrey", price: "desde $2,100" },
];

export default function PopularEvents() {
  return (
    <section id="conciertos" className="section">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Lo que todos están viviendo ahora</h2>
        <p className="text-light mt-2 max-w-3xl">
          Explora los espectáculos más buscados y prepárate para ser parte de momentos inolvidables.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sample.map((e, i) => (
            <article key={i} className="card overflow-hidden">
              <div className="relative aspect-[16/9]" style={{
                backgroundImage: `url('${e.img}')`, backgroundSize: "cover", backgroundPosition: "center"
              }} />
              <div className="p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-medium leading-tight">{e.title}</h3>
                  <p className="text-sm text-light">{e.city}</p>
                </div>
                <div className="text-right text-sm font-semibold">{e.price}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <a href="#conciertos" className="btn btn-secondary">Ver todos los eventos</a>
        </div>
      </div>
    </section>
  );
}