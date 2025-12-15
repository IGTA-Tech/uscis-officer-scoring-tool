/**
 * Inngest Background Functions
 *
 * These functions run in the background and can take up to 2 hours,
 * perfect for processing large documents.
 */

import { inngest } from './client';
import { runOfficerScoring } from '../scoring/officer-scorer';
import {
  getScoringSession,
  getFilesForSession,
  updateScoringSession,
  saveScoringResults,
  isSupabaseConfigured,
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

    // Step 2: Get document content from uploaded files
    const documentContent = await step.run('get-document-content', async () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Database not configured');
      }

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
