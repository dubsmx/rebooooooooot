const faqs = [
  { q:"¿Cuándo reciben su pago los vendedores?", a:"Unos días después del evento, asegurando que todo se haya cumplido con éxito." },
  { q:"¿Qué necesito para comprar?",            a:"Solo una cuenta con tu correo verificado. Nada más." },
  { q:"¿Qué necesito para vender?",             a:"Una verificación adicional que ayuda a mantener la confianza dentro de la comunidad." },
];
export default function FAQ() {
  return (
    <section className="section mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-bold">Lo que más nos preguntan</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {faqs.map((f,i)=>(
          <details key={i} className="card p-5">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="text-muted mt-2 text-sm">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}