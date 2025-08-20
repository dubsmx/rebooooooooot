"use client";
import { useRouter } from "next/navigation";

export default function BuyMenuButton({ listingId }: { listingId: string }) {
  const r = useRouter();
  return (
    <button onClick={() => r.push(`/buy/${listingId}`)} className="btn-primary">
      Buy now
    </button>
  );
}