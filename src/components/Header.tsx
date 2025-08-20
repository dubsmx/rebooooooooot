"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    const clickAway = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setOpen(false); };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", clickAway);
    document.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", clickAway);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full bg-black">
      <div className="mx-auto max-w-6xl px-3 py-3">
        <nav
          ref={menuRef}
          className={`nav-shell ${scrolled ? "is-scrolled" : ""} relative flex items-center gap-3 rounded-xl bg-black px-4 py-2 transition-[box-shadow]`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Boletera" width={22} height={22} />
            <span className="hidden sm:inline text-white text-sm font-semibold tracking-wide">Boletera</span>
          </Link>

          {/* Center nav (desktop) */}
          <div className="mx-auto hidden md:flex items-center gap-8 text-sm">
            <Link className="text-zinc-200 hover:text-white transition" href="/#how-it-works">How it works</Link>
            <Link className="text-zinc-200 hover:text-white transition" href="/sell">Sell</Link>
            <Link className="text-zinc-200 hover:text-white transition" href="/support">Support</Link>
            <Link className="text-zinc-200 hover:text-white transition" href="/blog">Blog</Link>
          </div>

          {/* Actions (desktop) – sólidos, sin transparencias */}
          <div className="ml-auto hidden md:flex items-center gap-2">
            <Link href="/login" className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black hover:bg-zinc-100">Login</Link>
            <Link href="/sell" className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700">Sell your tickets</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(v => !v)}
            className="ml-auto md:hidden inline-flex items-center justify-center rounded-xl bg-zinc-800 p-2 hover:bg-zinc-700"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Mobile dropdown – sólidos */}
          <div
            className={`absolute right-2 top-14 w-64 rounded-xl bg-black p-2 border border-zinc-800 transition
              ${open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}`}
          >
            <Link onClick={() => setOpen(false)} href="/#how-it-works" className="block rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900">How it works</Link>
            <Link onClick={() => setOpen(false)} href="/sell" className="block rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900">Sell</Link>
            <Link onClick={() => setOpen(false)} href="/support" className="block rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900">Support</Link>
            <Link onClick={() => setOpen(false)} href="/blog" className="block rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900">Blog</Link>
            <div className="my-2 h-px bg-zinc-800" />
            <Link onClick={() => setOpen(false)} href="/login" className="block rounded-xl bg-white px-3 py-2 text-center text-sm font-medium text-black hover:bg-zinc-100">Login</Link>
            <Link onClick={() => setOpen(false)} href="/sell" className="mt-2 block rounded-xl bg-zinc-800 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-700">Sell your tickets</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}