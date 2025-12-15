/**
 * Stripe Checkout API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured, PRICING } from '@/app/lib/stripe/stripe-client';
import { createFingerprint } from '@/app/lib/stripe/usage-tracker';

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { priceId } = body;

    // Get pricing details
    const pricing = Object.values(PRICING.PRICES).find(p => p.id === priceId || p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === priceId.replace(/[^a-z0-9]/g, ''));

    if (!pricing) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    // Create fingerprint for tracking
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const fingerprint = createFingerprint(ip, userAgent);

    const stripe = getStripe();

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Xtraordinary Petition Scoring - ${pricing.name}`,
              description: pricing.scorings === -1
                ? 'Unlimited monthly petition scorings'
                : `${pricing.scorings} petition scoring${pricing.scorings > 1 ? 's' : ''}`,
            },
            unit_amount: pricing.amount,
            ...(pricing.recurring ? { recurring: { interval: 'month' as const } } : {}),
          },
          quantity: 1,
        },
      ],
      mode: pricing.recurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        fingerprint,
        priceId: pricing.id,
        scorings: pricing.scorings.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[Checkout] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
