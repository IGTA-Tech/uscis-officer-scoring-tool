/**
 * USCIS Officer Scoring Engine
 *
 * This is the core scoring logic that evaluates visa petitions
 * from the perspective of a skeptical USCIS adjudications officer.
 */

import { callAIWithFallback } from '../ai/claude-client';
import {
  getOfficerSystemPrompt,
  getScoringPrompt,
  getOfficerChatPrompt,
} from './officer-prompts';
import {
  VisaType,
  DocumentType,
  ScoringResults,
  CriterionScore,
  RFEPrediction,
  EvidenceQuality,
  OverallRating,
  VISA_CRITERIA,
  MINIMUM_CRITERIA,
} from '../types';

export interface ScoringInput {
  sessionId: string;
  documentType: DocumentType;
  visaType: VisaType;
  beneficiaryName?: string;
  documentContent: string;
  rfeOriginalContent?: string; // For RFE response scoring
}

export interface RawScoringOutput {
  overallScore: number;
  overallRating: OverallRating;
  approvalProbability: number;
  rfeProbability: number;
  denialRisk: number;
  criteriaScores: CriterionScore[];
  evidenceQuality: EvidenceQuality;
  rfePredictions: RFEPrediction[];
  weaknesses: string[];
  strengths: string[];
  recommendations: {
    critical: string[];
    high: string[];
    recommended: string[];
  };
  fullReport: string;
}

/**
 * Main scoring function - runs the officer evaluation
 */
export async function runOfficerScoring(
  input: ScoringInput,
  onProgress?: (stage: string, progress: number, message: string) => void
): Promise<RawScoringOutput> {
  const { documentType, visaType, beneficiaryName, documentContent, rfeOriginalContent } = input;

  onProgress?.('Initializing', 5, 'Preparing officer evaluation...');

  // Build the document content for scoring
  let fullContent = documentContent;
  if (documentType === 'rfe_response' && rfeOriginalContent) {
    fullContent = `
=== ORIGINAL RFE FROM USCIS ===
${rfeOriginalContent}

=== PETITIONER'S RFE RESPONSE ===
${documentContent}
`;
  }

  // Get the officer system prompt
  const systemPrompt = getOfficerSystemPrompt(visaType);

  // Get the scoring prompt for this document type
  const scoringPrompt = getScoringPrompt(
    documentType,
    visaType,
    fullContent,
    beneficiaryName
  );

  onProgress?.('Scoring', 20, 'Officer is reviewing the petition...');

  // Call the AI with the officer persona
  const { content: rawReport, provider } = await callAIWithFallback(
    scoringPrompt,
    systemPrompt,
    16384, // Large token budget for comprehensive report
    0.4 // Slightly higher temperature for more natural officer voice
  );

  console.log(`[OfficerScorer] Generated report using ${provider}`);

  onProgress?.('Analyzing', 70, 'Extracting scoring metrics...');

  // Parse the raw report to extract structured data
  const structuredResults = parseOfficerReport(rawReport, visaType);

  onProgress?.('Finalizing', 95, 'Completing evaluation...');

  return {
    ...structuredResults,
    fullReport: rawReport,
  };
}

/**
 * Parse the officer's report to extract structured scoring data
 */
function parseOfficerReport(
  report: string,
  visaType: VisaType
): Omit<RawScoringOutput, 'fullReport'> {
  // Extract overall score from the report
  const overallScore = extractScore(report);

  // Determine overall rating based on score
  const overallRating = getOverallRating(overallScore);

  // Extract probabilities
  const { approval, rfe, denial } = extractProbabilities(report, overallScore);

  // Extract criterion scores
  const criteriaScores = extractCriteriaScores(report, visaType);

  // Extract evidence quality assessment
  const evidenceQuality = extractEvidenceQuality(report);

  // Extract RFE predictions
  const rfePredictions = extractRFEPredictions(report);

  // Extract weaknesses and strengths
  const weaknesses = extractListItems(report, 'RED FLAGS', 'CONCERNS', 'WEAKNESSES', 'MY CONCERNS');
  const strengths = extractListItems(report, 'STRENGTHS', 'STRONG', 'ACKNOWLEDGE');

  // Extract recommendations
  const recommendations = extractRecommendations(report);

  return {
    overallScore,
    overallRating,
    approvalProbability: approval,
    rfeProbability: rfe,
    denialRisk: denial,
    criteriaScores,
    evidenceQuality,
    rfePredictions,
    weaknesses,
    strengths,
    recommendations,
  };
}

/**
 * Extract overall score from report
 */
function extractScore(report: string): number {
  // Look for TOTAL score in scoring matrix
  const totalMatch = report.match(/\*\*TOTAL\*\*[^|]*\|[^|]*\|[^|]*\|\s*\*?\*?(\d+)\s*\/\s*100/i);
  if (totalMatch) {
    return parseInt(totalMatch[1], 10);
  }

  // Look for Overall Score pattern
  const scoreMatch = report.match(/overall\s+score[:\s]*(\d+)\s*(?:\/\s*100)?/i);
  if (scoreMatch) {
    return parseInt(scoreMatch[1], 10);
  }

  // Look for any score pattern
  const anyScore = report.match(/\*\*(\d+)\s*\/\s*100\*\*/);
  if (anyScore) {
    return parseInt(anyScore[1], 10);
  }

  // Default based on content analysis
  if (report.toLowerCase().includes('strong approval') || report.toLowerCase().includes('approve')) {
    return 75;
  }
  if (report.toLowerCase().includes('rfe likely')) {
    return 60;
  }
  if (report.toLowerCase().includes('denial') || report.toLowerCase().includes('major revision')) {
    return 40;
  }

  return 55; // Default middle score
}

/**
 * Get overall rating from score
 */
function getOverallRating(score: number): OverallRating {
  if (score >= 70) return 'Approve';
  if (score >= 50) return 'RFE Likely';
  return 'Denial Risk';
}

/**
 * Extract probability values
 */
function extractProbabilities(
  report: string,
  overallScore: number
): { approval: number; rfe: number; denial: number } {
  // Try to extract from report
  const approvalMatch = report.match(/approval\s+probability[:\s]*(\d+)\s*%/i);
  const rfeMatch = report.match(/rfe\s+probability[:\s]*(\d+)\s*%/i);
  const denialMatch = report.match(/denial\s+risk[:\s]*(\d+)\s*%/i);

  const approval = approvalMatch ? parseInt(approvalMatch[1], 10) : calculateApprovalProb(overallScore);
  const rfe = rfeMatch ? parseInt(rfeMatch[1], 10) : calculateRFEProb(overallScore);
  const denial = denialMatch ? parseInt(denialMatch[1], 10) : 100 - approval - rfe;

  return { approval, rfe, denial: Math.max(0, denial) };
}

function calculateApprovalProb(score: number): number {
  if (score >= 85) return 85;
  if (score >= 70) return 65;
  if (score >= 55) return 40;
  if (score >= 40) return 20;
  return 10;
}

function calculateRFEProb(score: number): number {
  if (score >= 85) return 10;
  if (score >= 70) return 25;
  if (score >= 55) return 45;
  if (score >= 40) return 50;
  return 40;
}

/**
 * Extract criterion-by-criterion scores
 */
function extractCriteriaScores(report: string, visaType: VisaType): CriterionScore[] {
  const criteria = VISA_CRITERIA[visaType];
  const scores: CriterionScore[] = [];

  for (const criterion of criteria) {
    // Look for this criterion in the report
    const criterionPattern = new RegExp(
      `criterion\\s*${criterion.number}[^]*?(?:my\\s+rating|rating)[:\\s]*([^\\n]+)`,
      'i'
    );
    const match = report.match(criterionPattern);

    // Extract score for this criterion
    const scorePattern = new RegExp(
      `criterion\\s*${criterion.number}[^]*?(?:evidence\\s+score|score)[:\\s]*(\\d+)`,
      'i'
    );
    const scoreMatch = report.match(scorePattern);

    const rating = match ? parseRating(match[1]) : 'Not Claimed';
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : ratingToScore(rating);

    // Extract concerns
    const concernsPattern = new RegExp(
      `criterion\\s*${criterion.number}[^]*?(?:my\\s+concerns|concerns)[:\\s]*([^#]+?)(?=\\n\\n|\\*\\*|$)`,
      'i'
    );
    const concernsMatch = report.match(concernsPattern);
    const concerns = concernsMatch
      ? extractBulletPoints(concernsMatch[1])
      : [];

    scores.push({
      criterionNumber: criterion.number,
      criterionName: criterion.name,
      rating,
      score,
      evidenceQuality: scoreToQuality(score),
      officerConcerns: concerns,
      strengths: [],
      suggestions: [],
    });
  }

  return scores;
}

function parseRating(text: string): CriterionScore['rating'] {
  const lower = text.toLowerCase();
  if (lower.includes('strong')) return 'Strong';
  if (lower.includes('adequate')) return 'Adequate';
  if (lower.includes('weak')) return 'Weak';
  if (lower.includes('insufficient')) return 'Insufficient';
  return 'Not Claimed';
}

function ratingToScore(rating: CriterionScore['rating']): number {
  switch (rating) {
    case 'Strong':
      return 85;
    case 'Adequate':
      return 70;
    case 'Weak':
      return 50;
    case 'Insufficient':
      return 30;
    case 'Not Claimed':
      return 0;
  }
}

function scoreToQuality(score: number): CriterionScore['evidenceQuality'] {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Fair';
  return 'Poor';
}

/**
 * Extract evidence quality assessment
 */
function extractEvidenceQuality(report: string): EvidenceQuality {
  // Try to extract tier counts
  const tier1Match = report.match(/tier\s*1[^|]*\|\s*(\d+)/i);
  const tier2Match = report.match(/tier\s*2[^|]*\|\s*(\d+)/i);
  const tier3Match = report.match(/tier\s*3[^|]*\|\s*(\d+)/i);
  const tier4Match = report.match(/tier\s*4[^|]*\|\s*(\d+)/i);

  const tier1Count = tier1Match ? parseInt(tier1Match[1], 10) : 0;
  const tier2Count = tier2Match ? parseInt(tier2Match[1], 10) : 0;
  const tier3Count = tier3Match ? parseInt(tier3Match[1], 10) : 0;
  const tier4Count = tier4Match ? parseInt(tier4Match[1], 10) : 0;

  // Determine overall assessment
  let overallAssessment: EvidenceQuality['overallAssessment'];
  if (tier1Count >= 5) {
    overallAssessment = 'Strong';
  } else if (tier1Count >= 3 || tier2Count >= 5) {
    overallAssessment = 'Moderate';
  } else if (tier1Count >= 1 || tier2Count >= 3) {
    overallAssessment = 'Weak';
  } else {
    overallAssessment = 'Insufficient';
  }

  // Extract concerns
  const concernsSection = report.match(/evidence.*?concerns[:\s]*([^#]+)/i);
  const concerns = concernsSection
    ? extractBulletPoints(concernsSection[1])
    : [];

  return {
    tier1Count,
    tier2Count,
    tier3Count,
    tier4Count,
    overallAssessment,
    concerns,
  };
}

/**
 * Extract RFE predictions
 */
function extractRFEPredictions(report: string): RFEPrediction[] {
  const predictions: RFEPrediction[] = [];

  // Look for RFE prediction table rows
  const rfeSection = report.match(/rfe\s+predictions?[^]*?(?=##|$)/i);
  if (!rfeSection) return predictions;

  // Match table rows: | Topic | Probability | Description |
  const rowPattern = /\|\s*([^|]+)\|\s*(\d+)\s*%?\s*\|\s*([^|]+)\|/g;
  let match;

  while ((match = rowPattern.exec(rfeSection[0])) !== null) {
    const topic = match[1].trim();
    const probability = parseInt(match[2], 10);
    const description = match[3].trim();

    if (topic && !topic.includes('Topic') && !topic.includes('---')) {
      predictions.push({
        topic,
        probability,
        officerPerspective: description,
        suggestedEvidence: [],
      });
    }
  }

  return predictions;
}

/**
 * Extract recommendations
 */
function extractRecommendations(report: string): {
  critical: string[];
  high: string[];
  recommended: string[];
} {
  const critical = extractListItems(report, 'CRITICAL', 'MUST DO', 'REQUIRED');
  const high = extractListItems(report, 'HIGH PRIORITY', 'SHOULD DO', 'IMPORTANT');
  const recommended = extractListItems(report, 'RECOMMENDED', 'WOULD HELP', 'SUGGESTED');

  return { critical, high, recommended };
}

/**
 * Extract bullet points from text
 */
function extractBulletPoints(text: string): string[] {
  const items: string[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Match bullet points: -, *, •, or numbered 1., 2., etc.
    if (/^[-*•]/.test(trimmed) || /^\d+\./.test(trimmed)) {
      const content = trimmed.replace(/^[-*•\d.]+\s*/, '').trim();
      if (content && content.length > 5) {
        items.push(content);
      }
    }
  }

  return items;
}

/**
 * Extract list items matching any of the keywords
 */
function extractListItems(report: string, ...keywords: string[]): string[] {
  for (const keyword of keywords) {
    const pattern = new RegExp(`${keyword}[^]*?(?=##|\\n\\n\\n|$)`, 'i');
    const match = report.match(pattern);
    if (match) {
      const items = extractBulletPoints(match[0]);
      if (items.length > 0) {
        return items;
      }
    }
  }
  return [];
}

/**
 * Generate chat response from the officer
 */
export async function generateOfficerChatResponse(
  visaType: VisaType,
  scoringSummary: string,
  chatHistory: { role: string; content: string }[],
  userMessage: string
): Promise<string> {
  const systemPrompt = getOfficerSystemPrompt(visaType);
  const chatPrompt = getOfficerChatPrompt(
    visaType,
    scoringSummary,
    [...chatHistory, { role: 'user', content: userMessage }]
  );

  const { content } = await callAIWithFallback(
    chatPrompt,
    systemPrompt,
    4096,
    0.5 // Slightly more conversational
  );

  return content;
}
