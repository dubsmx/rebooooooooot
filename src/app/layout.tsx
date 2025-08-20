import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Reboot — Boletos digitales",
  description: "Compra y vende boletos digitales con total confianza.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head><meta charSet="utf-8" /></head>
      <body className={`${inter.className} min-h-dvh font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}