/**
 * Supabase Database Client
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Get Supabase client (lazy initialization)
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase environment variables not configured');
    }

    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

// ==========================================
// SCORING SESSIONS
// ==========================================

export async function createScoringSession(data: {
  documentType: string;
  visaType: string;
  beneficiaryName?: string;
}) {
  const supabase = getSupabase();
  const { data: session, error } = await supabase
    .from('scoring_sessions')
    .insert({
      document_type: data.documentType,
      visa_type: data.visaType,
      beneficiary_name: data.beneficiaryName,
      status: 'uploading',
      progress: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return session;
}

export async function getScoringSession(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scoring_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateScoringSession(
  id: string,
  updates: {
    status?: string;
    progress?: number;
    progressMessage?: string;
    errorMessage?: string;
    completedAt?: string;
  }
) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scoring_sessions')
    .update({
      status: updates.status,
      progress: updates.progress,
      progress_message: updates.progressMessage,
      error_message: updates.errorMessage,
      completed_at: updates.completedAt,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listScoringSessions(limit: number = 20) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scoring_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ==========================================
// UPLOADED FILES
// ==========================================

export async function createUploadedFile(data: {
  sessionId: string;
  filename: string;
  fileType?: string;
  fileSize?: number;
  storagePath?: string;
}) {
  const supabase = getSupabase();
  const { data: file, error } = await supabase
    .from('uploaded_files')
    .insert({
      session_id: data.sessionId,
      filename: data.filename,
      file_type: data.fileType,
      file_size: data.fileSize,
      storage_path: data.storagePath,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return file;
}

export async function updateUploadedFile(
  id: string,
  updates: {
    status?: string;
    extractedText?: string;
    wordCount?: number;
    pageCount?: number;
    documentCategory?: string;
    storagePath?: string;
  }
) {
  const supabase = getSupabase();

  // Build update object, only including defined values
  const updateObj: Record<string, unknown> = {};
  if (updates.status !== undefined) updateObj.status = updates.status;
  if (updates.extractedText !== undefined) updateObj.extracted_text = updates.extractedText;
  if (updates.wordCount !== undefined) updateObj.word_count = updates.wordCount;
  if (updates.pageCount !== undefined) updateObj.page_count = updates.pageCount;
  if (updates.documentCategory !== undefined) updateObj.document_category = updates.documentCategory;
  if (updates.storagePath !== undefined) updateObj.storage_path = updates.storagePath;

  const { data, error } = await supabase
    .from('uploaded_files')
    .update(updateObj)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFilesForSession(sessionId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('uploaded_files')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// ==========================================
// SCORING RESULTS
// ==========================================

export async function saveScoringResults(data: {
  sessionId: string;
  overallScore: number;
  overallRating: string;
  approvalProbability: number;
  rfeProbability: number;
  denialRisk: number;
  criteriaScores: unknown;
  evidenceQuality: unknown;
  rfePredictions: unknown;
  weaknesses: unknown;
  strengths: unknown;
  recommendations: unknown;
  fullReport: string;
}) {
  const supabase = getSupabase();
  const { data: result, error } = await supabase
    .from('scoring_results')
    .insert({
      session_id: data.sessionId,
      overall_score: data.overallScore,
      overall_rating: data.overallRating,
      approval_probability: data.approvalProbability,
      rfe_probability: data.rfeProbability,
      denial_risk: data.denialRisk,
      criteria_scores: data.criteriaScores,
      evidence_quality: data.evidenceQuality,
      rfe_predictions: data.rfePredictions,
      weaknesses: data.weaknesses,
      strengths: data.strengths,
      recommendations: data.recommendations,
      full_report: data.fullReport,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getScoringResults(sessionId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scoring_results')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

// ==========================================
// CHAT MESSAGES
// ==========================================

export async function saveChatMessage(data: {
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getSupabase();
  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: data.sessionId,
      role: data.role,
      content: data.content,
      metadata: data.metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return message;
}

export async function getChatHistory(sessionId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// ==========================================
// RESEARCH RESULTS
// ==========================================

export async function saveResearchResults(data: {
  sessionId: string;
  researchType: string;
  query: string;
  results: unknown;
  sourcesFound: number;
}) {
  const supabase = getSupabase();
  const { data: result, error } = await supabase
    .from('research_results')
    .insert({
      session_id: data.sessionId,
      research_type: data.researchType,
      query: data.query,
      results: data.results,
      sources_found: data.sourcesFound,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}
