export type Event = {
  id: string;
  title: string;
  date: string; // ISO
  city: string;
  country: string;
  venue: string;
  image: string;
  source?: string;
  tmId?: string;
};

export type Listing = {
  id: string;
  sellerUid: string;
  eventId: string;
  price: number;
  currency: "MXN" | "USD";
  status: "active" | "sold" | "removed";
  storageKey: string;
  fileType: "pdf" | "pkpass";
  qrMessage: string;
  section?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const demoEvents: Event[] = [
  // Oasis â€” CDMX, Sept 2025
  {
    id: "ev_oasis_cdmx_2025_09_13",
    title: "Oasis â€” The Reunion Tour",
    date: "2025-09-13T20:30:00-06:00",
    city: "Mexico City",
    country: "Mexico",
    venue: "Palacio de los Deportes",
    image: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=1200&auto=format",
    source: "mock"
  },
  {
    id: "ev_oasis_cdmx_2025_09_14",
    title: "Oasis â€” The Reunion Tour (Night 2)",
    date: "2025-09-14T20:30:00-06:00",
    city: "Mexico City",
    country: "Mexico",
    venue: "Palacio de los Deportes",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format",
    source: "mock"
  },

  // Bad Bunny â€” MX 2025
  {
    id: "ev_badbunny_cdmx_2025_11_21",
    title: "Bad Bunny â€” Most Wanted Tour MX",
    date: "2025-11-21T21:00:00-06:00",
    city: "Mexico City",
    country: "Mexico",
    venue: "Foro Sol",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format",
    source: "mock"
  },
  {
    id: "ev_badbunny_mty_2025_11_28",
    title: "Bad Bunny â€” Most Wanted Tour MX (MTY)",
    date: "2025-11-28T21:00:00-06:00",
    city: "Monterrey",
    country: "Mexico",
    venue: "Estadio BBVA",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format",
    source: "mock"
  },

  // Rels B
  {
    id: "ev_relsb_cdmx_2025_10_10",
    title: "Rels B â€” Tour 2025",
    date: "2025-10-10T20:30:00-06:00",
    city: "Mexico City",
    country: "Mexico",
    venue: "Arena CDMX",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format",
    source: "mock"
  },

  // Day Zero Tulum
  {
    id: "ev_dayzero_tulum_2025_01_10",
    title: "Day Zero â€” Tulum 2025",
    date: "2025-01-10T23:00:00-05:00",
    city: "Tulum",
    country: "Mexico",
    venue: "Cenote Dos Ojos Area",
    image: "https://images.unsplash.com/photo-1526481280698-8fcc13fd1b65?q=80&w=1200&auto=format",
    source: "mock"
  },

  // Keinemusik
  {
    id: "ev_keinemusik_cdmx_2025_10_25",
    title: "Keinemusik â€” CDMX 2025",
    date: "2025-10-25T21:00:00-06:00",
    city: "Mexico City",
    country: "Mexico",
    venue: "Parque Bicentenario",
    image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=1200&auto=format",
    source: "mock"
  }
];

export const demoListings: Listing[] = [
  // Oasis (para probar MP)
  { id: "ls_oasis_01", sellerUid: "demo-seller", eventId: "ev_oasis_cdmx_2025_09_13", price: 1800, currency: "MXN", status: "active", storageKey: "demo/oasis-1.pdf", fileType: "pdf", qrMessage: "OASIS-QR-1", section: "General A" },
  { id: "ls_oasis_02", sellerUid: "demo-seller", eventId: "ev_oasis_cdmx_2025_09_13", price: 1900, currency: "MXN", status: "active", storageKey: "demo/oasis-2.pdf", fileType: "pdf", qrMessage: "OASIS-QR-2", section: "General B" },
  { id: "ls_oasis_03", sellerUid: "demo-seller", eventId: "ev_oasis_cdmx_2025_09_13", price: 2100, currency: "MXN", status: "active", storageKey: "demo/oasis-3.pdf", fileType: "pdf", qrMessage: "OASIS-QR-3", section: "General B" },
  { id: "ls_oasis_04", sellerUid: "demo-seller", eventId: "ev_oasis_cdmx_2025_09_14", price: 2000, currency: "MXN", status: "active", storageKey: "demo/oasis-4.pdf", fileType: "pdf", qrMessage: "OASIS-QR-4", section: "Grada 101" },

  // Otros (por si quieres navegar)
  { id: "ls_badbunny_01", sellerUid: "demo-seller", eventId: "ev_badbunny_cdmx_2025_11_21", price: 2500, currency: "MXN", status: "active", storageKey: "demo/badbunny-1.pdf", fileType: "pdf", qrMessage: "BB-QR-1" },
  { id: "ls_relsb_01", sellerUid: "demo-seller", eventId: "ev_relsb_cdmx_2025_10_10", price: 1200, currency: "MXN", status: "active", storageKey: "demo/relsb-1.pdf", fileType: "pdf", qrMessage: "RELS-QR-1" },
  { id: "ls_dayzero_01", sellerUid: "demo-seller", eventId: "ev_dayzero_tulum_2025_01_10", price: 1800, currency: "MXN", status: "active", storageKey: "demo/dayzero-1.pdf", fileType: "pdf", qrMessage: "DZ-QR-1" },
  { id: "ls_keinemusik_01", sellerUid: "demo-seller", eventId: "ev_keinemusik_cdmx_2025_10_25", price: 1600, currency: "MXN", status: "active", storageKey: "demo/km-1.pdf", fileType: "pdf", qrMessage: "KM-QR-1" }
];