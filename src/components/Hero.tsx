export default function Hero() {
  return (
    <section className="pt-20">
      <div className="mx-auto max-w-7xl px-4">
        <div
          className="relative w-full overflow-hidden rounded-[28px] border border-[#1A1A1A]"
          style={{
            height: "min(68vh, 680px)",
            backgroundImage: "url('/images/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#000" // fallback si no hay imagen
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Vive tus eventos con total confianza.
              </h1>
              <p className="text-muted mt-4 text-base md:text-lg">
                La plataforma que conecta a personas para comprar y vender boletos digitales de manera fácil, segura y transparente.
              </p>

              {/* Buscador centrado */}
              <div className="mt-8 w-full max-w-3xl mx-auto">
                <div className="flex gap-2">
                  <input className="input-black flex-1" placeholder="¿Cuál será tu próxima experiencia en vivo?" />
                  <button className="btn btn-primary">Buscar</button>
                </div>
              </div>

              {/* Botones */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a href="#eventos" className="btn btn-primary">Descubrir eventos</a>
                <a href="#vender" className="btn btn-secondary">Vender boletos</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}