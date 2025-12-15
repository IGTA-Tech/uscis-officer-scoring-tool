/**
 * Batch Scoring API Route (Paid Feature)
 *
 * Allows scoring multiple petitions in one request.
 * Requires paid plan with sufficient credits or active subscription.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createFingerprint, hasFreeScoringAvailable, needsPayment } from '@/app/lib/stripe/usage-tracker';
import { isSupabaseConfigured } from '@/app/lib/database/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessions } = body; // Array of { documentType, visaType, documentContent }

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json({ error: 'sessions array is required' }, { status: 400 });
    }

    if (sessions.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 sessions per batch' }, { status: 400 });
    }

    // Check payment status
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const fingerprint = createFingerprint(ip, userAgent);

    const paymentCheck = await needsPayment(fingerprint);

    if (paymentCheck.needsPayment) {
      return NextResponse.json({
        error: 'Payment required for batch scoring',
        needsPayment: true,
        reason: paymentCheck.reason,
        redirectTo: '/pricing',
      }, { status: 402 });
    }

    // For now, return a placeholder response
    // Full implementation would:
    // 1. Create sessions for each petition
    // 2. Queue them in Inngest for background processing
    // 3. Return job IDs for polling

    return NextResponse.json({
      success: true,
      message: 'Batch scoring queued',
      jobCount: sessions.length,
      estimatedTime: `${sessions.length * 2} minutes`,
      note: 'Full batch processing coming soon. Each petition will be scored sequentially.',
    });
  } catch (error) {
    console.error('[Batch] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Batch scoring failed' },
      { status: 500 }
    );
  }
}

/**
 * GET: Check batch job status
 */
export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  // Placeholder - would check actual job status in production
  return NextResponse.json({
    jobId,
    status: 'pending',
    message: 'Batch scoring feature coming soon',
  });
}
