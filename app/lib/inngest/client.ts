/**
 * Inngest Client Configuration
 *
 * Inngest handles background job processing for long-running tasks
 * like scoring large PDF documents.
 */

import { Inngest } from 'inngest';

// Create the Inngest client
export const inngest = new Inngest({
  id: 'xtraordinary-scoring',
  name: 'Xtraordinary Petition Scoring',
});

// Event types for type safety
export type ScoringRequestedEvent = {
  name: 'scoring/requested';
  data: {
    sessionId: string;
    documentType: string;
    visaType: string;
    beneficiaryName?: string;
  };
};

export type Events = {
  'scoring/requested': ScoringRequestedEvent;
};
