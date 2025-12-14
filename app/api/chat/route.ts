/**
 * Chat API Route
 * Handles chat with the USCIS Officer about scoring results
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateOfficerChatResponse } from '@/app/lib/scoring/officer-scorer';
import {
  getScoringSession,
  getScoringResults,
  getChatHistory,
  saveChatMessage,
  isSupabaseConfigured,
} from '@/app/lib/database/supabase';
import { VisaType } from '@/app/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    let visaType: VisaType = 'O-1A';
    let scoringSummary = '';
    let chatHistory: { role: string; content: string }[] = [];

    // Get context from database if configured
    if (isSupabaseConfigured()) {
      const session = await getScoringSession(sessionId);
      const results = await getScoringResults(sessionId);
      const history = await getChatHistory(sessionId);

      visaType = session.visa_type as VisaType;

      // Build scoring summary for context
      if (results) {
        scoringSummary = `
SCORING SUMMARY:
- Overall Score: ${results.overall_score}/100
- Rating: ${results.overall_rating}
- Approval Probability: ${results.approval_probability}%
- RFE Probability: ${results.rfe_probability}%
- Denial Risk: ${results.denial_risk}%

KEY WEAKNESSES:
${(results.weaknesses as string[])?.slice(0, 5).map((w: string) => `- ${w}`).join('\n') || 'None identified'}

KEY STRENGTHS:
${(results.strengths as string[])?.slice(0, 5).map((s: string) => `- ${s}`).join('\n') || 'None identified'}

RFE PREDICTIONS:
${(results.rfe_predictions as Array<{topic: string; probability: number}>)?.slice(0, 3).map((r) => `- ${r.topic} (${r.probability}% likely)`).join('\n') || 'None'}
`;
      }

      // Get chat history
      chatHistory = history.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }));

      // Save user message
      await saveChatMessage({
        sessionId,
        role: 'user',
        content: message,
      });
    }

    // Generate officer response
    const response = await generateOfficerChatResponse(
      visaType,
      scoringSummary,
      chatHistory,
      message
    );

    // Save assistant response
    if (isSupabaseConfigured()) {
      await saveChatMessage({
        sessionId,
        role: 'assistant',
        content: response,
      });
    }

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('[Chat] Response generation failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat failed' },
      { status: 500 }
    );
  }
}

/**
 * GET: Get chat history for a session
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
      messages: [],
    });
  }

  try {
    const history = await getChatHistory(sessionId);

    return NextResponse.json({
      sessionId,
      messages: history.map((m: { id: string; role: string; content: string; created_at: string }) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.created_at,
      })),
    });
  } catch (error) {
    console.error('[Chat] Get history failed:', error);
    return NextResponse.json(
      { error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}
