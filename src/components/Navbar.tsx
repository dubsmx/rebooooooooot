"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const Item = ({ href, children }:{ href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="block px-3 py-2 rounded-lg hover:bg-[#0b0b0b]"
      onClick={() => setOpen(false)}
    >
      {children}
    </a>
  );

  return (
    <header className="fixed top-4 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        {/* Barra rectangular (no píldora), bordes redondos, sin transparencia */}
        <div className="h-16 rounded-xl bg-black border border-[#1A1A1A] shadow-[0_8px_30px_rgba(0,0,0,0.6)] px-3 md:px-4 flex items-center gap-4">
          {/* Marca con logo y REBOOT en mayúsculas */}
          <a href="/" className="flex items-center gap-3">
            <Image src="/images/logo-reboot.svg" alt="Reboot logo" width={28} height={28} priority />
            <span className="tracking-wider font-semibold uppercase">REBOOT</span>
          </a>

          {/* Navegación (desktop) */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <ul className="flex items-center gap-6 text-sm">
              <li><a href="#conciertos">Conciertos</a></li>
              <li><a href="#deportes">Deportes</a></li>
              <li><a href="#ciudades">Ciudades</a></li>
              <li><a href="#vender">Vender boletos</a></li>
              <li><a href="#soporte">Soporte</a></li>
              <li><a href="#login">Iniciar sesión</a></li>
            </ul>
          </nav>

          {/* CTA (desktop) */}
          <div className="hidden md:block ml-auto">
            <a href="#signup" className="btn btn-primary">Crea tu cuenta</a>
          </div>

          {/* Hamburguesa (móvil) */}
          <button
            aria-label="Abrir menú"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="md:hidden ml-auto size-10 grid place-items-center rounded-lg border border-[#1A1A1A]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" role="img">
              <rect x="3" y="6" width="18" height="2" rx="1"></rect>
              <rect x="3" y="11" width="18" height="2" rx="1"></rect>
              <rect x="3" y="16" width="18" height="2" rx="1"></rect>
            </svg>
          </button>
        </div>

        {/* Menú móvil (links + CTA) */}
        {open && (
          <div id="mobile-menu" className="mt-2 rounded-xl bg-black border border-[#1A1A1A] overflow-hidden md:hidden">
            <div className="px-2 py-2 text-sm">
              <Item href="#conciertos">Conciertos</Item>
              <Item href="#deportes">Deportes</Item>
              <Item href="#ciudades">Ciudades</Item>
              <Item href="#vender">Vender boletos</Item>
              <Item href="#soporte">Soporte</Item>
              <Item href="#login">Iniciar sesión</Item>
              <div className="px-2 py-2">
                <a href="#signup" className="btn btn-primary w-full">Crea tu cuenta</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}