/**
 * Inngest API Route
 *
 * This route serves the Inngest functions and handles webhook callbacks.
 * Inngest will call this endpoint to execute background functions.
 */

import { serve } from 'inngest/next';
import { inngest } from '@/app/lib/inngest/client';
import { functions } from '@/app/lib/inngest/functions';

// Create the serve handler with explicit configuration
const handler = serve({
  client: inngest,
  functions,
  // Allow Inngest to sync without signing key in development
  serveHost: process.env.INNGEST_SERVE_HOST || 'https://xtraordinaryscoring.com',
  servePath: '/api/inngest',
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;

// Ensure dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
