const items = [
  { t:"Seguridad en cada compra",   d:"Cada boleto pasa por un proceso de validación que garantiza tu tranquilidad." },
  { t:"Una comunidad auténtica",    d:"Personas que como tú buscan vivir y compartir experiencias en vivo." },
  { t:"Acompañamiento constante",   d:"Nuestro equipo está siempre presente para apoyarte en lo que necesites." },
  { t:"Experiencias que inspiran",  d:"Música, deportes y arte en un solo lugar, listos para disfrutarse sin preocupaciones." },
];
export default function Benefits() {
  return (
    <section className="section mx-auto max-w-7xl px-4 py-14">
      <header className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold">Por qué elegir Reboot</h2>
      </header>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((b,i)=>(
          <div key={i} className="card p-5">
            <h3 className="font-semibold">{b.t}</h3>
            <p className="text-muted mt-2 text-sm">{b.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}