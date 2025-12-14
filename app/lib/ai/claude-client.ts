/**
 * Claude AI Client with Retry Logic and OpenAI Fallback
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Lazy initialization
let anthropicClient: Anthropic | null = null;
let openaiClient: OpenAI | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

function getOpenAIClient(): OpenAI | null {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

/**
 * Retry with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error as Error;
      const err = error as { status?: number; code?: string };

      // Don't retry on non-retryable errors
      if (err.status === 400 || err.status === 401 || err.status === 403) {
        throw error;
      }

      // Retryable: 429, 500, 502, 503, 504, network errors
      const isRetryable =
        err.status === 429 ||
        (err.status && err.status >= 500) ||
        err.code === 'ECONNRESET' ||
        err.code === 'ETIMEDOUT';

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`[Claude] Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Call Claude with retry logic
 */
export async function callClaude(
  prompt: string,
  systemPrompt: string,
  maxTokens: number = 8192,
  temperature: number = 0.3
): Promise<string> {
  const client = getAnthropicClient();

  const response = await retryWithBackoff(async () => {
    return await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  return textContent.text;
}

/**
 * Call OpenAI as fallback
 */
async function callOpenAI(
  prompt: string,
  systemPrompt: string,
  maxTokens: number = 8192,
  temperature: number = 0.3
): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error('OpenAI is not configured as fallback');
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: Math.min(maxTokens, 16384),
    temperature,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * Call AI with fallback: Claude primary, OpenAI fallback
 */
export async function callAIWithFallback(
  prompt: string,
  systemPrompt: string,
  maxTokens: number = 8192,
  temperature: number = 0.3
): Promise<{ content: string; provider: 'claude' | 'openai' }> {
  try {
    const content = await callClaude(prompt, systemPrompt, maxTokens, temperature);
    return { content, provider: 'claude' };
  } catch (claudeError) {
    console.error('[Claude] Primary API failed:', claudeError);

    // Try OpenAI fallback
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('[Claude] Attempting OpenAI fallback...');
        const content = await callOpenAI(prompt, systemPrompt, maxTokens, temperature);
        return { content, provider: 'openai' };
      } catch (openaiError) {
        console.error('[OpenAI] Fallback also failed:', openaiError);
      }
    }

    throw claudeError;
  }
}

/**
 * Stream Claude response
 */
export async function streamClaude(
  prompt: string,
  systemPrompt: string,
  maxTokens: number = 8192,
  temperature: number = 0.3,
  onChunk: (chunk: string) => void
): Promise<string> {
  const client = getAnthropicClient();
  let fullResponse = '';

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      const text = event.delta.text;
      fullResponse += text;
      onChunk(text);
    }
  }

  return fullResponse;
}
