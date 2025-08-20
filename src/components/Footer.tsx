export default function Footer() {
  return (
    <footer className="section mt-12 border-t border-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Reboot</h4>
          <p className="text-muted text-sm">Compra y venta de boletos digitales, sin complicaciones.</p>
        </div>
        <nav className="text-sm">
          <h5 className="font-semibold mb-3">Navegación</h5>
          <ul className="space-y-2 text-muted">
            <li><a href="#conciertos">Conciertos</a></li>
            <li><a href="#deportes">Deportes</a></li>
            <li><a href="#ciudades">Ciudades</a></li>
            <li><a href="#vender">Vender</a></li>
            <li><a href="#soporte">Soporte</a></li>
          </ul>
        </nav>
        <div className="text-sm">
          <h5 className="font-semibold mb-3">Legal</h5>
          <ul className="space-y-2 text-muted">
            <li><a href="#terms">Términos y condiciones</a></li>
            <li><a href="#privacy">Políticas de privacidad</a></li>
            <li><a href="#refunds">Reembolsos</a></li>
          </ul>
          <h5 className="font-semibold mt-6 mb-2">Redes sociales</h5>
          <ul className="flex gap-4 text-muted">
            <li><a href="#" aria-label="Facebook">Facebook</a></li>
            <li><a href="#" aria-label="Instagram">Instagram</a></li>
            <li><a href="#" aria-label="TikTok">TikTok</a></li>
            <li><a href="#" aria-label="X">X</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}