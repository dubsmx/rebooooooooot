import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_dummy", {
      apiVersion: "2024-06-20",
    });
  }
  return _stripe;
}

export const stripe = getStripe();