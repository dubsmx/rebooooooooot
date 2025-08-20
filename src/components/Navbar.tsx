"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/#concerts", label: "Conciertos" },
  { href: "/#sports", label: "Deportes" },
  { href: "/#cities", label: "Ciudades" },
  { href: "/sell", label: "Vender boletos" },
  { href: "/support", label: "Soporte" },
  { href: "/login", label: "Iniciar sesión" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center">
      <nav className="w-[95%] max-w-6xl h-14 rounded-2xl bg-black border border-[#222] px-3 md:px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo-reboot.svg" alt="REBOOT" width={24} height={24} priority />
          <span className="font-semibold tracking-wide text-white">REBOOT</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map(i => (
            <Link key={i.href} href={i.href} className="text-sm text-[#E5E5E5] hover:text-white transition-colors">
              {i.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/signup" className="btn btn-primary">Crea tu cuenta</Link>
        </div>

        <button
          aria-label="Abrir menú"
          onClick={() => setOpen(v => !v)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#333] text-white"
        >
          <span className="sr-only">Menú</span>
          <div className="space-y-1.5">
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </div>
        </button>
      </nav>

      {open && (
        <div className="md:hidden absolute top-20 w-[95%] max-w-6xl rounded-2xl bg-black border border-[#222] p-4">
          <div className="flex flex-col gap-3">
            {navItems.map(i => (
              <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="py-2 text-[#E5E5E5] hover:text-white">
                {i.label}
              </Link>
            ))}
            <Link href="/signup" onClick={() => setOpen(false)} className="btn btn-primary w-full">Crea tu cuenta</Link>
          </div>
        </div>
      )}
    </div>
  );
}