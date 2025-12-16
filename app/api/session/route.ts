/**
 * Session API Route
 *
 * Lightweight endpoint that creates sessions and records uploaded files.
 * File uploads happen directly to Supabase Storage from the browser.
 * This route just tracks the files and triggers background processing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { inngest } from '@/app/lib/inngest/client';
import {
  createScoringSession,
  createUploadedFile,
  updateUploadedFile,
  isSupabaseConfigured,
} from '@/app/lib/database/supabase';

// Check if Inngest is configured
function isInngestConfigured(): boolean {
  return process.env.NODE_ENV === 'development' || !!process.env.INNGEST_SIGNING_KEY;
}

/**
 * POST: Create a new session and record uploaded files
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentType, visaType, beneficiaryName, files } = body;

    // Validate required fields
    if (!documentType || !visaType) {
      return NextResponse.json(
        { error: 'documentType and visaType are required' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one file is required' },
        { status: 400 }
      );
    }

    // Validate visa type
    const validVisaTypes = ['P-1A', 'O-1A', 'O-1B', 'EB-1A'];
    if (!validVisaTypes.includes(visaType)) {
      return NextResponse.json(
        { error: `Invalid visaType. Must be one of: ${validVisaTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate document type
    const validDocTypes = ['full_petition', 'rfe_response', 'exhibit_packet', 'contract_deal_memo'];
    if (!validDocTypes.includes(documentType)) {
      return NextResponse.json(
        { error: `Invalid documentType. Must be one of: ${validDocTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Create session
    let sessionId: string;

    if (isSupabaseConfigured()) {
      const session = await createScoringSession({
        documentType,
        visaType,
        beneficiaryName: beneficiaryName || undefined,
      });
      sessionId = session.id;

      // Record each uploaded file
      for (const file of files) {
        const fileRecord = await createUploadedFile({
          sessionId,
          filename: file.filename,
          fileType: file.fileType,
          fileSize: file.fileSize,
        });

        // Update with storage path (file already uploaded to Supabase Storage by browser)
        await updateUploadedFile(fileRecord.id, {
          status: 'pending_extraction',
          storagePath: file.storagePath,
          documentCategory: detectDocumentCategory(file.filename),
        });
      }
    } else {
      sessionId = uuidv4();
    }

    // Trigger background processing with Inngest
    if (isInngestConfigured()) {
      console.log(`[Session] Triggering Inngest for session ${sessionId}`);

      await inngest.send({
        name: 'scoring/requested',
        data: {
          sessionId,
          documentType,
          visaType,
          beneficiaryName,
        },
      });

      return NextResponse.json({
        success: true,
        sessionId,
        status: 'queued',
        message: 'Files uploaded. Processing started in background.',
      });
    }

    // Fallback: return session ID for manual scoring
    return NextResponse.json({
      success: true,
      sessionId,
      status: 'ready',
      message: 'Session created. Call /api/score to start scoring.',
    });
  } catch (error) {
    console.error('[Session] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create session'
      },
      { status: 500 }
    );
  }
}

/**
 * Detect document category from filename
 */
function detectDocumentCategory(filename: string): string {
  const lower = filename.toLowerCase();

  if (lower.includes('rfe') && lower.includes('response')) return 'rfe_response';
  if (lower.includes('rfe') || lower.includes('request for evidence')) return 'rfe_original';
  if (lower.includes('exhibit')) return 'exhibit';
  if (lower.includes('contract') || lower.includes('deal') || lower.includes('agreement')) return 'contract';
  if (lower.includes('letter') && lower.includes('support')) return 'support_letter';
  if (lower.includes('letter') && lower.includes('recommend')) return 'recommendation';
  if (lower.includes('cv') || lower.includes('resume') || lower.includes('curriculum')) return 'cv';
  if (lower.includes('petition') || lower.includes('i-129') || lower.includes('i-140')) return 'petition';

  return 'document';
}
