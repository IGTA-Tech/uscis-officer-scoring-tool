/**
 * Score API Route
 * Initiates officer scoring for a session
 */

import { NextRequest, NextResponse } from 'next/server';
import { runOfficerScoring } from '@/app/lib/scoring/officer-scorer';
import {
  getScoringSession,
  getFilesForSession,
  updateScoringSession,
  saveScoringResults,
  isSupabaseConfigured,
} from '@/app/lib/database/supabase';
import { DocumentType, VisaType } from '@/app/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, documentContent, rfeOriginalContent } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    let session: {
      document_type: string;
      visa_type: string;
      beneficiary_name?: string;
    } | null = null;
    let files: { extracted_text?: string; document_category?: string }[] = [];
    let fullDocumentContent = documentContent || '';

    // Get session and files from database if configured
    if (isSupabaseConfigured()) {
      session = await getScoringSession(sessionId);
      files = await getFilesForSession(sessionId);

      // Build document content from uploaded files if not provided
      if (!documentContent && files.length > 0) {
        fullDocumentContent = files
          .map((f) => {
            const header = `=== FILE: ${f.document_category || 'Document'} ===`;
            return `${header}\n${f.extracted_text || '[No text extracted]'}`;
          })
          .join('\n\n---\n\n');
      }

      // Extract RFE original if this is an RFE response
      let rfeOriginal = rfeOriginalContent;
      if (!rfeOriginal && session?.document_type === 'rfe_response') {
        const rfeFile = files.find((f) => f.document_category === 'rfe_original');
        if (rfeFile) {
          rfeOriginal = rfeFile.extracted_text;
        }
      }

      // Update session status
      await updateScoringSession(sessionId, {
        status: 'scoring',
        progress: 15,
        progressMessage: 'Starting officer evaluation...',
      });
    }

    if (!fullDocumentContent) {
      return NextResponse.json(
        { error: 'No document content available for scoring' },
        { status: 400 }
      );
    }

    // Truncate very long documents to avoid AI timeout
    // Keep first 150,000 characters (~30,000 words, ~60 pages)
    const MAX_CONTENT_LENGTH = 150000;
    if (fullDocumentContent.length > MAX_CONTENT_LENGTH) {
      console.log(`[Score] Truncating document from ${fullDocumentContent.length} to ${MAX_CONTENT_LENGTH} characters`);
      fullDocumentContent = fullDocumentContent.substring(0, MAX_CONTENT_LENGTH) +
        '\n\n[... Document truncated for processing. Scoring based on first ~60 pages of content ...]';
    }

    // Get visa type and document type
    const visaType = (session?.visa_type || body.visaType || 'O-1A') as VisaType;
    const documentType = (session?.document_type || body.documentType || 'full_petition') as DocumentType;
    const beneficiaryName = session?.beneficiary_name || body.beneficiaryName;

    // Run the officer scoring
    const results = await runOfficerScoring(
      {
        sessionId,
        documentType,
        visaType,
        beneficiaryName,
        documentContent: fullDocumentContent,
        rfeOriginalContent: body.rfeOriginalContent,
      },
      async (stage, progress, message) => {
        // Update progress if database is configured
        if (isSupabaseConfigured()) {
          await updateScoringSession(sessionId, {
            progress,
            progressMessage: message,
          }).catch(console.error);
        }
      }
    );

    // Save results to database
    if (isSupabaseConfigured()) {
      await saveScoringResults({
        sessionId,
        overallScore: results.overallScore,
        overallRating: results.overallRating,
        approvalProbability: results.approvalProbability,
        rfeProbability: results.rfeProbability,
        denialRisk: results.denialRisk,
        criteriaScores: results.criteriaScores,
        evidenceQuality: results.evidenceQuality,
        rfePredictions: results.rfePredictions,
        weaknesses: results.weaknesses,
        strengths: results.strengths,
        recommendations: results.recommendations,
        fullReport: results.fullReport,
      });

      await updateScoringSession(sessionId, {
        status: 'completed',
        progress: 100,
        progressMessage: 'Scoring complete',
        completedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      sessionId,
      results: {
        overallScore: results.overallScore,
        overallRating: results.overallRating,
        approvalProbability: results.approvalProbability,
        rfeProbability: results.rfeProbability,
        denialRisk: results.denialRisk,
        criteriaScores: results.criteriaScores,
        evidenceQuality: results.evidenceQuality,
        rfePredictions: results.rfePredictions,
        weaknesses: results.weaknesses,
        strengths: results.strengths,
        recommendations: results.recommendations,
      },
      fullReport: results.fullReport,
    });
  } catch (error) {
    console.error('[Score] Scoring failed:', error);

    // Always return proper JSON
    const errorMessage = error instanceof Error ? error.message : 'Scoring failed';

    // Try to update session with error - don't await to avoid double timeout
    try {
      if (isSupabaseConfigured()) {
        // Get sessionId from the original request body if possible
        const bodyText = await request.text().catch(() => '{}');
        const body = JSON.parse(bodyText).catch?.(() => ({})) || {};
        if (body.sessionId) {
          updateScoringSession(body.sessionId, {
            status: 'error',
            errorMessage,
          }).catch(console.error);
        }
      }
    } catch {
      // Ignore errors when trying to update session
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: 'Scoring failed. If this is a large document, please try again or upload a smaller file.'
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Get scoring results for a session
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId is required' },
      { status: 400 }
    );
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    return NextResponse.json(
      { error: 'Invalid sessionId format. Must be a valid UUID.' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const session = await getScoringSession(sessionId);
    const { getScoringResults } = await import('@/app/lib/database/supabase');
    const results = await getScoringResults(sessionId);

    return NextResponse.json({
      sessionId,
      status: session.status,
      progress: session.progress,
      progressMessage: session.progress_message,
      results: results
        ? {
            overallScore: results.overall_score,
            overallRating: results.overall_rating,
            approvalProbability: results.approval_probability,
            rfeProbability: results.rfe_probability,
            denialRisk: results.denial_risk,
            criteriaScores: results.criteria_scores,
            evidenceQuality: results.evidence_quality,
            rfePredictions: results.rfe_predictions,
            weaknesses: results.weaknesses,
            strengths: results.strengths,
            recommendations: results.recommendations,
            fullReport: results.full_report,
          }
        : null,
    });
  } catch (error) {
    console.error('[Score] Get results failed:', error);
    return NextResponse.json(
      { error: 'Failed to get scoring results' },
      { status: 500 }
    );
  }
}
