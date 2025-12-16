/**
 * Inngest Background Functions
 *
 * These functions run in the background and can take up to 2 hours,
 * perfect for processing large documents.
 */

import { inngest } from './client';
import { runOfficerScoring } from '../scoring/officer-scorer';
import { extractTextFromPDF, extractTextFromImage } from '../ai/mistral-ocr';
import {
  getScoringSession,
  getFilesForSession,
  updateScoringSession,
  saveScoringResults,
  updateUploadedFile,
  isSupabaseConfigured,
  getSupabase,
} from '../database/supabase';
import { DocumentType, VisaType } from '../types';

/**
 * Background scoring function
 * Triggered when a user uploads documents for scoring
 */
export const scorePetition = inngest.createFunction(
  {
    id: 'score-petition',
    name: 'Score Petition Documents',
    // Retry configuration
    retries: 2,
    // Cancel if we receive another scoring request for same session
    cancelOn: [
      {
        event: 'scoring/requested',
        match: 'data.sessionId',
      },
    ],
  },
  { event: 'scoring/requested' },
  async ({ event, step }) => {
    const { sessionId, documentType, visaType, beneficiaryName } = event.data;

    console.log(`[Inngest] Starting background scoring for session ${sessionId}`);

    // Step 1: Update status to processing
    await step.run('update-status-processing', async () => {
      if (isSupabaseConfigured()) {
        await updateScoringSession(sessionId, {
          status: 'processing',
          progress: 5,
          progressMessage: 'Starting background processing...',
        });
      }
    });

    // Step 2: Extract text from files that need it
    await step.run('extract-text-from-files', async () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Database not configured');
      }

      const files = await getFilesForSession(sessionId);
      const supabase = getSupabase();

      for (const file of files) {
        // Skip files that already have extracted text
        if (file.extracted_text && file.extracted_text.length > 100) {
          continue;
        }

        // Check if file needs extraction (has storage path)
        if (!file.storage_path) {
          console.log(`[Inngest] File ${file.filename} has no storage path, skipping`);
          continue;
        }

        console.log(`[Inngest] Extracting text from ${file.filename}`);

        await updateScoringSession(sessionId, {
          progress: 10,
          progressMessage: `Extracting text from ${file.filename}...`,
        });

        // Download file from storage
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('scoring-documents')
          .download(file.storage_path);

        if (downloadError || !fileData) {
          console.error(`[Inngest] Failed to download ${file.filename}:`, downloadError);
          continue;
        }

        const buffer = Buffer.from(await fileData.arrayBuffer());
        let extractedText = '';
        let pageCount = 0;

        // Extract based on file type
        if (file.file_type === 'application/pdf') {
          const result = await extractTextFromPDF(buffer, file.filename);
          extractedText = result.text;
          pageCount = result.pageCount;
        } else if (file.file_type?.startsWith('image/')) {
          extractedText = await extractTextFromImage(buffer, file.file_type, file.filename);
          pageCount = 1;
        } else if (file.file_type === 'text/plain') {
          extractedText = buffer.toString('utf-8');
          pageCount = Math.ceil(extractedText.split(/\s+/).length / 500);
        }

        const wordCount = extractedText.split(/\s+/).filter((w: string) => w.length > 0).length;

        // Update file record with extracted text
        await updateUploadedFile(file.id, {
          status: 'completed',
          extractedText,
          wordCount,
          pageCount,
        });

        console.log(`[Inngest] Extracted ${wordCount} words from ${file.filename}`);
      }
    });

    // Step 3: Get document content from uploaded files
    const documentContent = await step.run('get-document-content', async () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Database not configured');
      }

      // Re-fetch files to get updated extracted text
      const files = await getFilesForSession(sessionId);

      if (files.length === 0) {
        throw new Error('No files found for this session');
      }

      // Build document content from uploaded files
      const content = files
        .map((f: { document_category?: string; extracted_text?: string }) => {
          const header = `=== FILE: ${f.document_category || 'Document'} ===`;
          return `${header}\n${f.extracted_text || '[No text extracted]'}`;
        })
        .join('\n\n---\n\n');

      // Truncate if too long (150k chars max)
      const MAX_LENGTH = 150000;
      if (content.length > MAX_LENGTH) {
        return content.substring(0, MAX_LENGTH) +
          '\n\n[... Document truncated for processing ...]';
      }

      return content;
    });

    // Step 3: Update status to scoring
    await step.run('update-status-scoring', async () => {
      if (isSupabaseConfigured()) {
        await updateScoringSession(sessionId, {
          status: 'scoring',
          progress: 20,
          progressMessage: 'Officer is reviewing the petition...',
        });
      }
    });

    // Step 4: Run the AI scoring (this is the long-running part)
    const results = await step.run('run-officer-scoring', async () => {
      return runOfficerScoring(
        {
          sessionId,
          documentType: documentType as DocumentType,
          visaType: visaType as VisaType,
          beneficiaryName,
          documentContent,
        },
        async (stage, progress, message) => {
          // Update progress in database
          if (isSupabaseConfigured()) {
            await updateScoringSession(sessionId, {
              progress,
              progressMessage: message,
            }).catch(console.error);
          }
        }
      );
    });

    // Step 5: Save results
    await step.run('save-results', async () => {
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
          progressMessage: 'Scoring complete!',
          completedAt: new Date().toISOString(),
        });
      }
    });

    console.log(`[Inngest] Completed scoring for session ${sessionId}`);

    return {
      success: true,
      sessionId,
      overallScore: results.overallScore,
      overallRating: results.overallRating,
    };
  }
);

// Export all functions
export const functions = [scorePetition];
