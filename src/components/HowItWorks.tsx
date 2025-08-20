const rows = [
  { t:"Compra en segundos",       d:"Encuentra tu boleto y recíbelo en tu cuenta digital." },
  { t:"Confianza en cada paso",   d:"Nuestro equipo valida que todo esté en orden antes de que tu boleto esté disponible." },
  { t:"Pago asegurado",           d:"Los vendedores reciben su pago días después del evento, garantizando tranquilidad para todos." },
];
export default function HowItWorks() {
  return (
    <section className="section mx-auto max-w-7xl px-4 py-14">
      <header className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold">Tan sencillo como debería ser</h2>
        <p className="text-muted mt-3">
          En Reboot todo está diseñado para que disfrutes tus eventos sin complicaciones:
        </p>
      </header>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {rows.map((r,i)=>(
          <div key={i} className="card p-5">
            <h3 className="font-semibold">{r.t}</h3>
            <p className="text-muted mt-2 text-sm">{r.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}