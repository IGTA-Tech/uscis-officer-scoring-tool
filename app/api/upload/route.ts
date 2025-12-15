/**
 * File Upload API Route
 * Handles file uploads with support for large files (100MB+)
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { extractTextFromPDF, extractTextFromImage, detectDocumentCategory } from '@/app/lib/ai/mistral-ocr';
import {
  createScoringSession,
  createUploadedFile,
  updateUploadedFile,
  updateScoringSession,
  isSupabaseConfigured,
  getSupabase,
} from '@/app/lib/database/supabase';

// Max file size: 150MB
const MAX_FILE_SIZE = 150 * 1024 * 1024;

// Supported file types
const SUPPORTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get session parameters
    const documentType = formData.get('documentType') as string;
    const visaType = formData.get('visaType') as string;
    const beneficiaryName = formData.get('beneficiaryName') as string | null;
    const sessionId = formData.get('sessionId') as string | null;

    // Validate required fields for new session
    if (!sessionId && (!documentType || !visaType)) {
      return NextResponse.json(
        { error: 'documentType and visaType are required for new sessions' },
        { status: 400 }
      );
    }

    // Validate visa type
    const validVisaTypes = ['P-1A', 'O-1A', 'O-1B', 'EB-1A'];
    if (visaType && !validVisaTypes.includes(visaType)) {
      return NextResponse.json(
        { error: `Invalid visaType. Must be one of: ${validVisaTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate document type
    const validDocTypes = ['full_petition', 'rfe_response', 'exhibit_packet', 'contract_deal_memo'];
    if (documentType && !validDocTypes.includes(documentType)) {
      return NextResponse.json(
        { error: `Invalid documentType. Must be one of: ${validDocTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Get files from form data
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && !['documentType', 'visaType', 'beneficiaryName', 'sessionId'].includes(key)) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // Validate files
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
          { status: 400 }
        );
      }

      if (!SUPPORTED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not supported` },
          { status: 400 }
        );
      }
    }

    // Create or use existing session
    let currentSessionId: string;
    if (sessionId) {
      currentSessionId = sessionId;
    } else if (isSupabaseConfigured()) {
      const session = await createScoringSession({
        documentType: documentType!,
        visaType: visaType!,
        beneficiaryName: beneficiaryName || undefined,
      });
      currentSessionId = session.id;
    } else {
      currentSessionId = uuidv4();
    }

    // Process each file
    const processedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        const fileId = uuidv4();
        const buffer = Buffer.from(await file.arrayBuffer());

        // Create file record if Supabase is configured
        let fileRecord = null;
        if (isSupabaseConfigured()) {
          fileRecord = await createUploadedFile({
            sessionId: currentSessionId,
            filename: file.name,
            fileType: file.type,
            fileSize: file.size,
          });

          // Upload to Supabase Storage
          const supabase = getSupabase();
          const storagePath = `scoring/${currentSessionId}/${fileId}_${sanitizeFilename(file.name)}`;

          const { error: uploadError } = await supabase.storage
            .from('scoring-documents')
            .upload(storagePath, buffer, {
              contentType: file.type,
              upsert: true,
            });

          if (uploadError) {
            console.error('[Upload] Storage upload failed:', uploadError);
          } else {
            await updateUploadedFile(fileRecord.id, {
              status: 'processing',
            });
          }
        }

        // Extract text based on file type
        let extractedText = '';
        let pageCount = 0;

        if (file.type === 'application/pdf') {
          const result = await extractTextFromPDF(buffer, file.name);
          extractedText = result.text;
          pageCount = result.pageCount;
        } else if (file.type.startsWith('image/')) {
          extractedText = await extractTextFromImage(buffer, file.type, file.name);
          pageCount = 1;
        } else if (file.type === 'text/plain') {
          extractedText = buffer.toString('utf-8');
          pageCount = Math.ceil(extractedText.split(/\s+/).length / 500);
        }

        // Detect document category
        const documentCategory = detectDocumentCategory(file.name, extractedText);

        // Calculate word count
        const wordCount = extractedText.split(/\s+/).filter(w => w.length > 0).length;

        // Update file record with extraction results
        if (isSupabaseConfigured() && fileRecord) {
          await updateUploadedFile(fileRecord.id, {
            status: 'completed',
            extractedText,
            wordCount,
            pageCount,
            documentCategory,
          });
        }

        processedFiles.push({
          id: fileRecord?.id || fileId,
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          wordCount,
          pageCount,
          documentCategory,
          extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
        });
      } catch (fileError) {
        console.error(`[Upload] Error processing file ${file.name}:`, fileError);
        errors.push({
          filename: file.name,
          error: fileError instanceof Error ? fileError.message : 'Unknown error',
        });
      }
    }

    // Update session status
    if (isSupabaseConfigured()) {
      await updateScoringSession(currentSessionId, {
        status: errors.length > 0 && processedFiles.length === 0 ? 'error' : 'processing',
        progress: 10,
        progressMessage: `Processed ${processedFiles.length} file(s)`,
        errorMessage: errors.length > 0 ? `Errors in ${errors.length} file(s)` : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      files: processedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('[Upload] Request failed:', error);
    // Always return proper JSON even on errors
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Sanitize filename for storage
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100);
}

/**
 * GET: Get upload status
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId is required' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      sessionId,
      status: 'unknown',
      message: 'Database not configured',
    });
  }

  try {
    const { getScoringSession, getFilesForSession } = await import('@/app/lib/database/supabase');

    const session = await getScoringSession(sessionId);
    const files = await getFilesForSession(sessionId);

    return NextResponse.json({
      sessionId,
      status: session.status,
      progress: session.progress,
      files: files.map((f: { id: string; filename: string; status: string; word_count: number; page_count: number; document_category: string }) => ({
        id: f.id,
        filename: f.filename,
        status: f.status,
        wordCount: f.word_count,
        pageCount: f.page_count,
        category: f.document_category,
      })),
    });
  } catch (error) {
    console.error('[Upload] Status check failed:', error);
    return NextResponse.json(
      { error: 'Failed to get upload status' },
      { status: 500 }
    );
  }
}
