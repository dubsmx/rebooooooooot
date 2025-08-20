const ts = [
  { q:"“Compré para un concierto y todo fue rapidísimo. Entré sin problemas.”",                a:"— Camila R." },
  { q:"“Pude revender mi boleto fácilmente, y el proceso fue claro en cada paso.”",            a:"— Juan M."   },
  { q:"“Me dio mucha confianza, siempre sentí que Reboot estaba cuidando mi compra.”",         a:"— Daniela T."},
];
export default function Testimonials() {
  return (
    <section className="section mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-bold">Historias que nos inspiran</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {ts.map((t,i)=>(
          <blockquote key={i} className="card p-5 text-sm">
            <p>{t.q}</p>
            <footer className="mt-3 text-muted">{t.a}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}