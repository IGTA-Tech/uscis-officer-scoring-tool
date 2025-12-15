/**
 * Inngest API Route
 *
 * This route serves the Inngest functions and handles webhook callbacks.
 * Inngest will call this endpoint to execute background functions.
 */

import { serve } from 'inngest/next';
import { inngest } from '@/app/lib/inngest/client';
import { functions } from '@/app/lib/inngest/functions';

// Create the serve handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
