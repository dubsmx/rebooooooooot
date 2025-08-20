"use client";
import { useSearchParams } from "next/navigation";

export default function ProcessingClient() {
  const p = useSearchParams();
  const r = p.get("ref");
  return <p className="text-[#E5E5E5]">Procesando tu orden{r ? ` (${r})` : ""}…</p>;
}