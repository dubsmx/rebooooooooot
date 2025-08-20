# rescate-boletera.ps1
$ErrorActionPreference = "Stop"
Write-Host "== Rescate Boletera ==" -ForegroundColor Cyan

# 1) Dependencias clave
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm i next@latest react react-dom
npm i -D tailwindcss@^4 @tailwindcss/postcss autoprefixer typescript @types/node

# 2) PostCSS correcto (Tailwind v4)
@'
import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: {
    tailwind,
    autoprefixer,
  },
};
'@ | Set-Content -Encoding utf8 "./postcss.config.mjs"

# 3) Estructura
New-Item -ItemType Directory -Force -Path "./src/app" | Out-Null
New-Item -ItemType Directory -Force -Path "./src/components" | Out-Null
New-Item -ItemType Directory -Force -Path "./public/images" | Out-Null

# 4) globals.css (tema negro + utilidades)
@'
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  --color-bg: #000000;
  --color-card: #0b0b0b;
  --color-muted: #a3a3a3;
  --color-border: #171717;
  --color-primary: #ffffff;
  --radius: 16px;
}

:root, html, body { height: 100%; background: var(--color-bg); color: var(--color-primary); }
* { border-color: var(--color-border); }
a { text-decoration: none; }

.nav--shadow { transition: box-shadow .2s ease; }
.nav--shadow.scrolled { box-shadow: 0 6px 24px rgba(255,255,255,.06); }

.card { background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius); }

.sticky-buybar {
  position: sticky; top: 64px; z-index: 30;
  background: color-mix(in oklab, black 90%, white 10%);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: saturate(120%) blur(8px);
}
'@ | Set-Content -Encoding utf8 "./src/app/globals.css"

# 5) layout.tsx (importa globals.css SIEMPRE)
@'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Boletera",
  description: "Marketplace de boletos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
'@ | Set-Content -Encoding utf8 "./src/app/layout.tsx"

# 6) Navbar
@'
"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-40 nav--shadow ${scrolled ? "scrolled" : ""}`}>
      <nav className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-white"></div>
            <span className="text-sm tracking-wider uppercase">Boletera</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <a className="opacity-80 hover:opacity-100" href="#conciertos">Conciertos</a>
            <a className="opacity-80 hover:opacity-100" href="#deportes">Deportes</a>
            <a className="opacity-80 hover:opacity-100" href="#ciudades">Ciudades</a>
            <a className="opacity-80 hover:opacity-100" href="#vender">Vender</a>
            <a className="rounded-full border border-white/15 px-3 py-1" href="#login">Iniciar sesión</a>
          </div>

          <button onClick={() => setOpen(v => !v)} className="md:hidden rounded-xl border border-white/15 px-3 py-1">
            Menú
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 flex flex-col gap-3 text-sm">
            <a href="#conciertos">Conciertos</a>
            <a href="#deportes">Deportes</a>
            <a href="#ciudades">Ciudades</a>
            <a href="#vender">Vender</a>
            <a href="#soporte">Soporte</a>
            <a className="rounded-lg border border-white/15 px-3 py-2 text-center" href="#login">Iniciar sesión</a>
          </div>
        </div>
      )}
    </header>
  );
}
'@ | Set-Content -Encoding utf8 "./src/components/Navbar.tsx"

# 7) Hero (con fallback si no hay imagen)
@'
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-16">
      <div className="relative h-[48vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Concierto"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4 w-full">
            <h1 className="text-3xl md:text-5xl font-semibold">Reinicia la diversión</h1>
            <p className="mt-2 text-neutral-300">Tu próxima aventura en vivo comienza hoy.</p>

            <div className="mt-6 max-w-3xl">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2">
                <input
                  className="flex-1 bg-transparent outline-none px-3 py-2 placeholder:text-neutral-500"
                  placeholder="¿Cuál será tu próxima aventura?"
                />
                <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium">Buscar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'@ | Set-Content -Encoding utf8 "./src/components/Hero.tsx"

# 8) Tarjeta de evento
@'
import Image from "next/image";

type Props = { title: string; city: string; date: string; price: string; img: string; };

export default function EventCard({ title, city, date, price, img }: Props) {
  return (
    <article className="card overflow-hidden hover:scale-[1.01] transition">
      <div className="relative aspect-[16/9]">
        <Image src={img} alt={title} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
      </div>
      <div className="p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-medium leading-tight">{title}</h3>
          <p className="text-xs text-neutral-400">{city} • {date}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-300">desde</p>
          <p className="text-lg font-semibold">{price}</p>
        </div>
      </div>
    </article>
  );
}
'@ | Set-Content -Encoding utf8 "./src/components/EventCard.tsx"

# 9) Home (usa Navbar + Hero + barra compra + grid)
@'
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";

const events = [
  { title: "Oasis — The Reunion Tour (Night 2)", city: "CDMX", date: "Sep 14, 2025", price: "$1,250", img: "/images/event1.jpg" },
  { title: "Rels B — Tour 2025", city: "CDMX", date: "Oct 10, 2025", price: "$890", img: "/images/event2.jpg" },
  { title: "Taylor Swift — The Eras", city: "Monterrey", date: "Nov 2, 2025", price: "$2,100", img: "/images/event3.jpg" },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />

        <div className="sticky-buybar">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
            <span className="text-sm text-neutral-300">Explora eventos por ciudad, fecha o artista.</span>
            <a href="#vender" className="rounded-xl border border-white/15 px-3 py-2 text-sm">Vender boletos</a>
          </div>
        </div>

        <section id="populares" className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold">Eventos populares en México</h2>
            <a className="text-sm opacity-80 hover:opacity-100" href="#ver-mas">Ver todos</a>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {events.map((e, i) => (
              <EventCard key={i} {...e} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
'@ | Set-Content -Encoding utf8 "./src/app/page.tsx"

# 10) Coloca placeholders locales si no existen (para evitar 404 de imágenes)
@'
# Imagenes simples en negro; puedes reemplazarlas luego
'@ | Out-Null
$imgBytes = [byte[]](,0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A) # cabecera PNG mínima
Set-Content -Path "./public/images/hero.jpg" -Value $imgBytes -Encoding Byte
Set-Content -Path "./public/images/event1.jpg" -Value $imgBytes -Encoding Byte
Set-Content -Path "./public/images/event2.jpg" -Value $imgBytes -Encoding Byte
Set-Content -Path "./public/images/event3.jpg" -Value $imgBytes -Encoding Byte

# 11) Limpieza y recordatorio
if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }
Write-Host "Listo. Arranca con: npm run dev" -ForegroundColor Green
