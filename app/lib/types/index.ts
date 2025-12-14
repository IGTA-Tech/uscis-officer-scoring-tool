/**
 * USCIS Officer Scoring Tool - Type Definitions
 */

// Visa Types
export type VisaType = 'P-1A' | 'O-1A' | 'O-1B' | 'EB-1A';

// Document Types to Score
export type DocumentType =
  | 'full_petition'
  | 'rfe_response'
  | 'exhibit_packet'
  | 'contract_deal_memo';

// Session Status
export type SessionStatus =
  | 'uploading'
  | 'processing'
  | 'scoring'
  | 'completed'
  | 'error';

// Criterion Rating
export type CriterionRating =
  | 'Strong'
  | 'Adequate'
  | 'Weak'
  | 'Insufficient'
  | 'Not Claimed';

// Overall Rating
export type OverallRating = 'Approve' | 'RFE Likely' | 'Denial Risk';

// Scoring Session
export interface ScoringSession {
  id: string;
  documentType: DocumentType;
  visaType: VisaType;
  beneficiaryName?: string;
  status: SessionStatus;
  progress: number;
  progressMessage?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Uploaded File
export interface UploadedFile {
  id: string;
  sessionId: string;
  filename: string;
  fileType?: string;
  fileSize?: number;
  storagePath?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  extractedText?: string;
  wordCount?: number;
  pageCount?: number;
  documentCategory?: string;
  createdAt: string;
}

// Criterion Score
export interface CriterionScore {
  criterionNumber: number;
  criterionName: string;
  rating: CriterionRating;
  score: number; // 0-100
  evidenceQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  officerConcerns: string[];
  strengths: string[];
  suggestions: string[];
}

// RFE Prediction
export interface RFEPrediction {
  topic: string;
  probability: number; // 0-100
  officerPerspective: string;
  suggestedEvidence: string[];
}

// Evidence Quality Assessment
export interface EvidenceQuality {
  tier1Count: number; // Major media
  tier2Count: number; // Trade publications
  tier3Count: number; // Online sources
  tier4Count: number; // Self-published/weak
  overallAssessment: 'Strong' | 'Moderate' | 'Weak' | 'Insufficient';
  concerns: string[];
}

// Scoring Results
export interface ScoringResults {
  id: string;
  sessionId: string;
  overallScore: number; // 0-100
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
  createdAt: string;
}

// Chat Message
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Visa Criteria Definitions
export const VISA_CRITERIA: Record<VisaType, { number: number; name: string; letter: string }[]> = {
  'O-1A': [
    { number: 1, letter: 'A', name: 'Nationally or internationally recognized prizes or awards' },
    { number: 2, letter: 'B', name: 'Membership in associations requiring outstanding achievements' },
    { number: 3, letter: 'C', name: 'Published material about the beneficiary' },
    { number: 4, letter: 'D', name: 'Participation as a judge of others\' work' },
    { number: 5, letter: 'E', name: 'Original contributions of major significance' },
    { number: 6, letter: 'F', name: 'Authorship of scholarly articles' },
    { number: 7, letter: 'G', name: 'Employment in a critical or essential capacity' },
    { number: 8, letter: 'H', name: 'High salary or remuneration' },
  ],
  'O-1B': [
    { number: 1, letter: 'A', name: 'Performed as a lead or starring participant' },
    { number: 2, letter: 'B', name: 'Critical reviews or other published material' },
    { number: 3, letter: 'C', name: 'Performed for organizations with distinguished reputation' },
    { number: 4, letter: 'D', name: 'Record of major commercial or critically acclaimed successes' },
    { number: 5, letter: 'E', name: 'Received significant recognition from organizations, critics, or experts' },
    { number: 6, letter: 'F', name: 'High salary or substantial remuneration' },
  ],
  'P-1A': [
    { number: 1, letter: 'A', name: 'International recognition in the sport' },
    { number: 2, letter: 'B', name: 'Significant participation with a major United States sports league' },
    { number: 3, letter: 'C', name: 'Significant participation in international competition' },
    { number: 4, letter: 'D', name: 'Significant participation in a prior season with a major U.S. college' },
    { number: 5, letter: 'E', name: 'Written statement from an official of the sport' },
    { number: 6, letter: 'F', name: 'International ranking' },
  ],
  'EB-1A': [
    { number: 1, letter: 'A', name: 'Nationally or internationally recognized prizes or awards' },
    { number: 2, letter: 'B', name: 'Membership in associations requiring outstanding achievements' },
    { number: 3, letter: 'C', name: 'Published material about the beneficiary' },
    { number: 4, letter: 'D', name: 'Participation as a judge of others\' work' },
    { number: 5, letter: 'E', name: 'Original contributions of major significance' },
    { number: 6, letter: 'F', name: 'Authorship of scholarly articles' },
    { number: 7, letter: 'G', name: 'Display of work at artistic exhibitions' },
    { number: 8, letter: 'H', name: 'Leading or critical role in distinguished organizations' },
    { number: 9, letter: 'I', name: 'High salary or remuneration' },
    { number: 10, letter: 'J', name: 'Commercial successes in the performing arts' },
  ],
};

// Minimum criteria required per visa type
export const MINIMUM_CRITERIA: Record<VisaType, number> = {
  'O-1A': 3,
  'O-1B': 3,
  'P-1A': 2,
  'EB-1A': 3,
};
