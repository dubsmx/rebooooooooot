import { env } from "./env";

export type CreatePreferenceInput = {
  orderId: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: "MXN" | "USD" | "EUR";
  listingId: string;
};

export async function createPreference(input: CreatePreferenceInput) {
  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      items: [{ title: input.title, quantity: input.quantity, unit_price: input.unit_price, currency_id: input.currency_id }],
      external_reference: input.orderId,
      metadata: { listingId: input.listingId, orderId: input.orderId },
      auto_return: "approved",
      back_urls: {
        success: "http://localhost:3000/success",
        pending: "http://localhost:3000/pending",
        failure: "http://localhost:3000/failure"
      }
    })
  });
  if (!res.ok) throw new Error(`MP create preference failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ id: string; init_point: string }>;
}

export async function fetchPayment(paymentId: string) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}` }
  });
  if (!res.ok) throw new Error(`MP fetch payment failed: ${res.status}`);
  return res.json();
}