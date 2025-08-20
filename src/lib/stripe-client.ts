"use client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripeJsPromise: Promise<Stripe | null> | null = null;

export function getStripeJs() {
  if (!stripeJsPromise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    stripeJsPromise = loadStripe(pk);
  }
  return stripeJsPromise;
}