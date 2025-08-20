import admin from "firebase-admin";

const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
if (!creds) throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON missing");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(creds)) });
}
const db = admin.firestore();

async function main() {
  const batch = db.batch();
  const eventsRef = db.collection("events");

  const items = [
    {
      id: "ev_mty_01",
      title: "Rauw Alejandro – Saturno World Tour",
      date: "2025-11-02T20:30:00-06:00",
      city: "Monterrey",
      country: "Mexico",
      venue: "Arena Monterrey",
      image: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=1200&auto=format",
      source: "ticketmaster",
      tmId: "tm_fake_1",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: "ev_cdmx_01",
      title: "The Weeknd – Live in Mexico City",
      date: "2025-12-10T21:00:00-06:00",
      city: "Mexico City",
      country: "Mexico",
      venue: "Foro Sol",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format",
      source: "ticketmaster",
      tmId: "tm_fake_2",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  for (const e of items) batch.set(eventsRef.doc(e.id), e, { merge: true });

  const listingsRef = db.collection("listings");
  batch.set(listingsRef.doc("ls_demo_01"), {
    sellerUid: "demo-seller",
    eventId: "ev_mty_01",
    price: 1500,
    currency: "MXN",
    status: "active",
    storageKey: "demo/demo-ticket.pdf",
    fileType: "pdf",
    qrMessage: "DEMO-QR-123456",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();
  console.log("Seed ok.");
}

main().catch(e => { console.error(e); process.exit(1); });