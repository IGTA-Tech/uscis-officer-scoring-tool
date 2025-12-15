/**
 * Usage Tracking for Free/Paid Scorings
 *
 * Tracks usage via:
 * 1. localStorage (client-side, for anonymous users)
 * 2. Supabase (server-side, for authenticated users)
 * 3. Fingerprint-based tracking (IP + user agent hash)
 */

import { isSupabaseConfigured, getSupabase } from '../database/supabase';
import crypto from 'crypto';

// Create fingerprint from IP and user agent
export function createFingerprint(ip: string, userAgent: string): string {
  const data = `${ip}-${userAgent}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
}

// Check if paywall is enabled
export function isPaywallEnabled(): boolean {
  return process.env.PAYWALL_ENABLED === 'true';
}

// Check if user has free scorings remaining
export async function hasFreeScoringAvailable(fingerprint: string): Promise<boolean> {
  // If paywall is disabled, always allow
  if (!isPaywallEnabled()) {
    return true;
  }

  if (!isSupabaseConfigured()) {
    return true; // Allow if no database
  }

  const supabase = getSupabase();

  // Check usage_tracking table
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('free_scorings_used, paid_scorings_remaining, subscription_active')
    .eq('fingerprint', fingerprint)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[UsageTracker] Error checking usage:', error);
    return true; // Allow on error
  }

  if (!data) {
    // New user - has free scoring
    return true;
  }

  // Check if they have free scoring left, paid credits, or active subscription
  if (data.free_scorings_used < 1) return true;
  if (data.paid_scorings_remaining > 0) return true;
  if (data.subscription_active) return true;

  return false;
}

// Check if user needs to pay
export async function needsPayment(fingerprint: string): Promise<{ needsPayment: boolean; reason: string }> {
  // If paywall is disabled, never require payment
  if (!isPaywallEnabled()) {
    return { needsPayment: false, reason: 'Paywall disabled - free access' };
  }

  if (!isSupabaseConfigured()) {
    return { needsPayment: false, reason: 'Database not configured' };
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('fingerprint', fingerprint)
    .single();

  if (error && error.code !== 'PGRST116') {
    return { needsPayment: false, reason: 'Error checking usage' };
  }

  if (!data) {
    return { needsPayment: false, reason: 'First scoring is free' };
  }

  if (data.subscription_active) {
    return { needsPayment: false, reason: 'Active subscription' };
  }

  if (data.paid_scorings_remaining > 0) {
    return { needsPayment: false, reason: `${data.paid_scorings_remaining} paid scorings remaining` };
  }

  if (data.free_scorings_used < 1) {
    return { needsPayment: false, reason: 'Free scoring available' };
  }

  return { needsPayment: true, reason: 'Free scoring used, no paid credits' };
}

// Record a scoring usage
export async function recordScoringUsage(fingerprint: string, sessionId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();

  // Get or create usage record
  const { data: existing } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('fingerprint', fingerprint)
    .single();

  if (!existing) {
    // Create new record with free scoring used
    await supabase.from('usage_tracking').insert({
      fingerprint,
      free_scorings_used: 1,
      paid_scorings_remaining: 0,
      subscription_active: false,
      last_scoring_at: new Date().toISOString(),
    });
  } else if (existing.subscription_active) {
    // Subscription user - just update timestamp
    await supabase
      .from('usage_tracking')
      .update({ last_scoring_at: new Date().toISOString() })
      .eq('fingerprint', fingerprint);
  } else if (existing.paid_scorings_remaining > 0) {
    // Deduct from paid credits
    await supabase
      .from('usage_tracking')
      .update({
        paid_scorings_remaining: existing.paid_scorings_remaining - 1,
        last_scoring_at: new Date().toISOString(),
      })
      .eq('fingerprint', fingerprint);
  } else {
    // Using free scoring
    await supabase
      .from('usage_tracking')
      .update({
        free_scorings_used: existing.free_scorings_used + 1,
        last_scoring_at: new Date().toISOString(),
      })
      .eq('fingerprint', fingerprint);
  }

  // Log the scoring event
  await supabase.from('scoring_events').insert({
    fingerprint,
    session_id: sessionId,
    event_type: 'scoring_completed',
  });
}

// Add paid credits
export async function addPaidCredits(fingerprint: string, credits: number, stripeSessionId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('fingerprint', fingerprint)
    .single();

  if (!existing) {
    await supabase.from('usage_tracking').insert({
      fingerprint,
      free_scorings_used: 0,
      paid_scorings_remaining: credits,
      subscription_active: false,
      stripe_customer_id: stripeSessionId,
    });
  } else {
    await supabase
      .from('usage_tracking')
      .update({
        paid_scorings_remaining: existing.paid_scorings_remaining + credits,
      })
      .eq('fingerprint', fingerprint);
  }
}

// Activate subscription
export async function activateSubscription(fingerprint: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabase();

  await supabase
    .from('usage_tracking')
    .upsert({
      fingerprint,
      subscription_active: true,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
    }, { onConflict: 'fingerprint' });
}
