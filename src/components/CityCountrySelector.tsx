"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function CityCountrySelector() {
  const router = useRouter();
  const sp = useSearchParams();
  const country = sp.get("country") ?? (process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? "Mexico");
  const city = sp.get("city") ?? (process.env.NEXT_PUBLIC_DEFAULT_CITY ?? "Mexico City");

  const cities = useMemo(() => country === "Mexico"
    ? ["Mexico City","Monterrey","Guadalajara"]
    : ["Los Angeles","New York"], [country]);

  function setParam(k: string, v: string) {
    const p = new URLSearchParams(sp?.toString());
    p.set(k, v);
    router.push(`/?${p.toString()}`);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <select className="border rounded px-3 py-2" value={country} onChange={(e) => setParam("country", e.target.value)}>
        <option>Mexico</option>
        <option>United States</option>
      </select>
      <select className="border rounded px-3 py-2" value={city} onChange={(e) => setParam("city", e.target.value)}>
        {cities.map(c => <option key={c}>{c}</option>)}
      </select>
    </div>
  );
}