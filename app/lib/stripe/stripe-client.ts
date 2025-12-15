/**
 * Stripe Client Configuration
 */

import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// Pricing tier type
interface PricingTier {
  id: string;
  name: string;
  amount: number;
  scorings: number;
  recurring?: boolean;
}

// Pricing tiers
export const PRICING = {
  FREE_SCORINGS: 1,
  PRICES: {
    single: {
      id: process.env.STRIPE_PRICE_SINGLE || 'price_single',
      name: 'Single Scoring',
      amount: 4900, // $49.00
      scorings: 1,
    } as PricingTier,
    pack5: {
      id: process.env.STRIPE_PRICE_PACK5 || 'price_pack5',
      name: '5-Pack',
      amount: 19900, // $199.00
      scorings: 5,
    } as PricingTier,
    pack10: {
      id: process.env.STRIPE_PRICE_PACK10 || 'price_pack10',
      name: '10-Pack',
      amount: 34900, // $349.00
      scorings: 10,
    } as PricingTier,
    unlimited: {
      id: process.env.STRIPE_PRICE_UNLIMITED || 'price_unlimited',
      name: 'Unlimited Monthly',
      amount: 49900, // $499.00/month
      scorings: -1, // unlimited
      recurring: true,
    } as PricingTier,
  },
};
