export type EventItem = {
  slug: string;
  title: string;
  city: string;
  date: string;
  priceMXN: number;
  available: number;
  img: string;       // /images/...
  priceId?: string;  // opcional
};
export const prices = {
  OASIS: process.env.NEXT_PUBLIC_PRICE_OASIS ?? "",
  RELSB: process.env.NEXT_PUBLIC_PRICE_RELSB ?? "",
  TAYLOR: process.env.NEXT_PUBLIC_PRICE_TAYLOR ?? "",
};
export const events: EventItem[] = [
  {
    slug: "oasis-reunion-night-2",
    title: "Oasis — The Reunion Tour (Night 2)",
    city: "CDMX",
    date: "Sep 14, 2025",
    priceMXN: 1250,
    available: 42,
    img: "/images/event-oasis.jpg",
    priceId: prices.OASIS,
  },
  {
    slug: "relsb-tour-2025",
    title: "Rels B — Tour 2025",
    city: "CDMX",
    date: "Oct 10, 2025",
    priceMXN: 890,
    available: 19,
    img: "/images/event-relsb.jpg",
    priceId: prices.RELSB,
  },
  {
    slug: "taylor-eras-mty",
    title: "Taylor Swift — The Eras",
    city: "Monterrey",
    date: "Nov 2, 2025",
    priceMXN: 2100,
    available: 0,
    img: "/images/event-taylor.jpg",
    priceId: prices.TAYLOR,
  },
];
export const bySlug = Object.fromEntries(events.map(e => [e.slug, e]));