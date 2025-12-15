/**
 * Stripe Webhook Handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/app/lib/stripe/stripe-client';
import { addPaidCredits, activateSubscription } from '@/app/lib/stripe/usage-tracker';

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  const stripe = getStripe();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { fingerprint, scorings } = session.metadata || {};

        if (!fingerprint) {
          console.error('[Stripe Webhook] No fingerprint in metadata');
          break;
        }

        const scoringsNum = parseInt(scorings || '0', 10);

        if (session.mode === 'subscription') {
          // Subscription activated
          await activateSubscription(
            fingerprint,
            session.customer as string,
            session.subscription as string
          );
          console.log(`[Stripe Webhook] Activated subscription for ${fingerprint}`);
        } else if (scoringsNum > 0) {
          // One-time purchase - add credits
          await addPaidCredits(fingerprint, scoringsNum, session.id);
          console.log(`[Stripe Webhook] Added ${scoringsNum} credits for ${fingerprint}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription cancelled - handled via database flag
        const subscription = event.data.object;
        console.log(`[Stripe Webhook] Subscription cancelled: ${subscription.id}`);
        // Would update subscription_active = false in database
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log(`[Stripe Webhook] Payment failed for invoice: ${invoice.id}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 400 }
    );
  }
}
