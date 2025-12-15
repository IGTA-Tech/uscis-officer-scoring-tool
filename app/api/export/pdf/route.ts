/**
 * PDF Export API Route
 *
 * Generates a professional PDF report from scoring results.
 * Uses HTML-to-PDF conversion for styling flexibility.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getScoringSession, getScoringResults, isSupabaseConfigured } from '@/app/lib/database/supabase';

// UUID validation
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  if (!sessionId || !uuidRegex.test(sessionId)) {
    return NextResponse.json({ error: 'Valid sessionId is required' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const session = await getScoringSession(sessionId);
    const results = await getScoringResults(sessionId);

    if (!results) {
      return NextResponse.json({ error: 'Scoring results not found' }, { status: 404 });
    }

    // Generate HTML report
    const html = generatePDFHTML(session, results);

    // Return HTML with PDF generation instructions
    // In production, use puppeteer or a PDF service
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="xtraordinary-scoring-${sessionId.substring(0, 8)}.html"`,
      },
    });
  } catch (error) {
    console.error('[PDF Export] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    );
  }
}

function generatePDFHTML(session: Record<string, unknown>, results: Record<string, unknown>): string {
  const criteriaScores = results.criteria_scores as Array<{
    criterionNumber: number;
    criterionName: string;
    rating: string;
    score: number;
    officerConcerns: string[];
  }> || [];

  const rfePredictions = results.rfe_predictions as Array<{
    topic: string;
    probability: number;
    officerPerspective: string;
  }> || [];

  const recommendations = results.recommendations as {
    critical: string[];
    high: string[];
    recommended: string[];
  } || { critical: [], high: [], recommended: [] };

  const weaknesses = results.weaknesses as string[] || [];
  const strengths = results.strengths as string[] || [];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Xtraordinary Petition Scoring Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #f59e0b; }
    .header h1 { color: #f59e0b; font-size: 28px; margin-bottom: 10px; }
    .header .subtitle { color: #64748b; font-size: 14px; }
    .score-card { background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
    .score-item { padding: 15px; background: white; border-radius: 8px; }
    .score-value { font-size: 36px; font-weight: bold; }
    .score-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .score-green { color: #22c55e; }
    .score-amber { color: #f59e0b; }
    .score-red { color: #ef4444; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 18px; color: #1e293b; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
    .criterion { background: #f8fafc; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
    .criterion-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .criterion-name { font-weight: 600; }
    .criterion-score { font-weight: bold; padding: 4px 12px; border-radius: 4px; font-size: 14px; }
    .rating-strong { background: #dcfce7; color: #166534; }
    .rating-adequate { background: #fef3c7; color: #92400e; }
    .rating-weak { background: #fee2e2; color: #991b1b; }
    .concerns { font-size: 13px; color: #64748b; }
    .rfe-item { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 15px; margin-bottom: 10px; }
    .rfe-header { display: flex; justify-content: space-between; font-weight: 600; color: #92400e; }
    .list-item { display: flex; gap: 8px; margin-bottom: 8px; font-size: 14px; }
    .list-icon { flex-shrink: 0; }
    .icon-red { color: #ef4444; }
    .icon-amber { color: #f59e0b; }
    .icon-green { color: #22c55e; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
    @media print { body { padding: 20px; } .score-card { break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Xtraordinary Petition Scoring</h1>
    <div class="subtitle">USCIS Officer Assessment Report</div>
    <div class="subtitle" style="margin-top: 10px;">
      ${session.visa_type || 'O-1A'} | ${session.beneficiary_name || 'Unnamed Beneficiary'} | ${new Date().toLocaleDateString()}
    </div>
  </div>

  <div class="score-card">
    <div class="score-grid">
      <div class="score-item">
        <div class="score-value ${getScoreClass(results.overall_score as number)}">${results.overall_score}</div>
        <div class="score-label">Overall Score</div>
      </div>
      <div class="score-item">
        <div class="score-value score-green">${results.approval_probability}%</div>
        <div class="score-label">Approval</div>
      </div>
      <div class="score-item">
        <div class="score-value score-amber">${results.rfe_probability}%</div>
        <div class="score-label">RFE Likely</div>
      </div>
      <div class="score-item">
        <div class="score-value score-red">${results.denial_risk}%</div>
        <div class="score-label">Denial Risk</div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px; padding: 15px; background: ${getRatingBg(results.overall_rating as string)}; border-radius: 8px;">
      <strong>Verdict: ${results.overall_rating}</strong>
    </div>
  </div>

  <div class="section">
    <h2>Criterion-by-Criterion Analysis</h2>
    ${criteriaScores.map(c => `
      <div class="criterion">
        <div class="criterion-header">
          <span class="criterion-name">Criterion ${c.criterionNumber}: ${c.criterionName}</span>
          <span class="criterion-score ${getRatingClass(c.rating)}">${c.score}/100 - ${c.rating}</span>
        </div>
        ${c.officerConcerns.length > 0 ? `<div class="concerns">Concerns: ${c.officerConcerns.join('; ')}</div>` : ''}
      </div>
    `).join('')}
  </div>

  ${rfePredictions.length > 0 ? `
  <div class="section">
    <h2>RFE Predictions</h2>
    ${rfePredictions.map(r => `
      <div class="rfe-item">
        <div class="rfe-header">
          <span>${r.topic}</span>
          <span>${r.probability}% likely</span>
        </div>
        <div style="font-size: 13px; margin-top: 5px;">${r.officerPerspective}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <h2>Key Findings</h2>
    ${weaknesses.length > 0 ? `
      <h3 style="font-size: 14px; color: #ef4444; margin-bottom: 10px;">Weaknesses</h3>
      ${weaknesses.map(w => `<div class="list-item"><span class="list-icon icon-red">&#9679;</span> ${w}</div>`).join('')}
    ` : ''}
    ${strengths.length > 0 ? `
      <h3 style="font-size: 14px; color: #22c55e; margin: 15px 0 10px;">Strengths</h3>
      ${strengths.map(s => `<div class="list-item"><span class="list-icon icon-green">&#9679;</span> ${s}</div>`).join('')}
    ` : ''}
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    ${recommendations.critical.length > 0 ? `
      <h3 style="font-size: 14px; color: #ef4444; margin-bottom: 10px;">Critical (Must Do)</h3>
      ${recommendations.critical.map(r => `<div class="list-item"><span class="list-icon icon-red">&#10006;</span> ${r}</div>`).join('')}
    ` : ''}
    ${recommendations.high.length > 0 ? `
      <h3 style="font-size: 14px; color: #f59e0b; margin: 15px 0 10px;">High Priority</h3>
      ${recommendations.high.map(r => `<div class="list-item"><span class="list-icon icon-amber">&#9888;</span> ${r}</div>`).join('')}
    ` : ''}
    ${recommendations.recommended.length > 0 ? `
      <h3 style="font-size: 14px; color: #22c55e; margin: 15px 0 10px;">Recommended</h3>
      ${recommendations.recommended.map(r => `<div class="list-item"><span class="list-icon icon-green">&#10004;</span> ${r}</div>`).join('')}
    ` : ''}
  </div>

  <div class="footer">
    <p>Generated by Xtraordinary Petition Scoring | ${new Date().toISOString()}</p>
    <p style="margin-top: 5px;">This report is for educational purposes only. Always consult with a qualified immigration attorney.</p>
  </div>
</body>
</html>
  `;
}

function getScoreClass(score: number): string {
  if (score >= 70) return 'score-green';
  if (score >= 50) return 'score-amber';
  return 'score-red';
}

function getRatingClass(rating: string): string {
  if (rating === 'Strong' || rating === 'Approve') return 'rating-strong';
  if (rating === 'Adequate' || rating === 'RFE Likely') return 'rating-adequate';
  return 'rating-weak';
}

function getRatingBg(rating: string): string {
  if (rating === 'Approve') return '#dcfce7';
  if (rating === 'RFE Likely') return '#fef3c7';
  return '#fee2e2';
}
