/**
 * Email Results API Route
 *
 * Sends scoring results via email using SendGrid or similar service.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getScoringSession, getScoringResults, isSupabaseConfigured } from '@/app/lib/database/supabase';

// UUID validation
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, email } = body;

    // Validate inputs
    if (!sessionId || !uuidRegex.test(sessionId)) {
      return NextResponse.json({ error: 'Valid sessionId is required' }, { status: 400 });
    }

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Get scoring data
    const session = await getScoringSession(sessionId);
    const results = await getScoringResults(sessionId);

    if (!results) {
      return NextResponse.json({ error: 'Scoring results not found' }, { status: 404 });
    }

    // Generate email content
    const emailContent = generateEmailHTML(session, results);

    // Send email (using SendGrid if configured)
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = await import('@sendgrid/mail');
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

      await sgMail.default.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@xtraordinary.ai',
        subject: `Your Xtraordinary Petition Scoring Results - Score: ${results.overall_score}/100`,
        html: emailContent,
      });

      return NextResponse.json({
        success: true,
        message: `Results sent to ${email}`,
      });
    } else {
      // Return the email content for manual sending
      return NextResponse.json({
        success: false,
        message: 'Email service not configured. Contact support for results.',
        emailContent, // For debugging/manual sending
      });
    }
  } catch (error) {
    console.error('[Email Results] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(session: Record<string, unknown>, results: Record<string, unknown>): string {
  const score = results.overall_score as number;
  const scoreColor = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  const weaknesses = results.weaknesses as string[] || [];
  const recommendations = results.recommendations as { critical: string[]; high: string[]; recommended: string[] } || { critical: [], high: [], recommended: [] };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #f59e0b; margin: 0;">Xtraordinary</h1>
      <p style="color: #64748b; margin: 5px 0 0;">Petition Scoring Results</p>
    </div>

    <!-- Score Card -->
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
      <div style="font-size: 48px; font-weight: bold; color: ${scoreColor};">${score}/100</div>
      <div style="font-size: 14px; color: #64748b; text-transform: uppercase;">Overall Score</div>
      <div style="margin-top: 15px; padding: 10px; background: ${score >= 70 ? '#dcfce7' : score >= 50 ? '#fef3c7' : '#fee2e2'}; border-radius: 4px;">
        <strong>${results.overall_rating}</strong>
      </div>
    </div>

    <!-- Quick Stats -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
      <div style="text-align: center; flex: 1;">
        <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${results.approval_probability}%</div>
        <div style="font-size: 12px; color: #64748b;">Approval</div>
      </div>
      <div style="text-align: center; flex: 1;">
        <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${results.rfe_probability}%</div>
        <div style="font-size: 12px; color: #64748b;">RFE Likely</div>
      </div>
      <div style="text-align: center; flex: 1;">
        <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${results.denial_risk}%</div>
        <div style="font-size: 12px; color: #64748b;">Denial Risk</div>
      </div>
    </div>

    <!-- Key Issues -->
    ${weaknesses.length > 0 ? `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #ef4444; font-size: 14px; margin-bottom: 10px;">Key Issues Identified</h3>
      <ul style="margin: 0; padding-left: 20px; color: #374151;">
        ${weaknesses.slice(0, 3).map(w => `<li style="margin-bottom: 5px;">${w}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Top Recommendations -->
    ${recommendations.critical.length > 0 ? `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #f59e0b; font-size: 14px; margin-bottom: 10px;">Top Recommendations</h3>
      <ul style="margin: 0; padding-left: 20px; color: #374151;">
        ${recommendations.critical.slice(0, 3).map(r => `<li style="margin-bottom: 5px;">${r}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://xtraordinary.ai'}/scoring/${session.id}"
         style="display: inline-block; background: #f59e0b; color: #1a1a1a; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold;">
        View Full Report
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
      <p>This assessment is for educational purposes only.</p>
      <p>Always consult with a qualified immigration attorney.</p>
    </div>
  </div>
</body>
</html>
  `;
}
