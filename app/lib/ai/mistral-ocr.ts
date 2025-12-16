/**
 * PDF and Image Text Extraction
 *
 * Uses pdf-parse for reliable PDF text extraction (handles large files)
 * Falls back to Mistral OCR for image-based PDFs or images
 */

import { Mistral } from '@mistralai/mistralai';

// Polyfill for DOMMatrix which pdf-parse/pdfjs requires but doesn't exist in serverless
if (typeof globalThis.DOMMatrix === 'undefined') {
  // @ts-expect-error - polyfill for serverless environment
  globalThis.DOMMatrix = class DOMMatrix {
    constructor() {
      return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    }
  };
}

// Dynamic import for pdf-parse to avoid ESM issues
async function parsePDF(buffer: Buffer): Promise<{ text: string; numpages: number }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');
  return pdfParse(buffer);
}

let mistralClient: Mistral | null = null;

function getMistralClient(): Mistral {
  if (!mistralClient) {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY is not configured');
    }
    mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }
  return mistralClient;
}

/**
 * Extract text from PDF
 * Uses Mistral OCR as primary method (more reliable in serverless)
 * Falls back to pdf-parse for very large files
 */
export async function extractTextFromPDF(
  pdfBuffer: Buffer,
  filename: string
): Promise<{ text: string; pageCount: number }> {
  const fileSizeMB = pdfBuffer.length / (1024 * 1024);
  console.log(`[PDF] Extracting text from ${filename} (${fileSizeMB.toFixed(2)}MB)`);

  // For files under 10MB, use Mistral OCR (more reliable in serverless)
  if (pdfBuffer.length < 10 * 1024 * 1024) {
    console.log('[PDF] Using Mistral OCR for extraction...');
    try {
      return await extractTextFromPDFWithMistral(pdfBuffer, filename);
    } catch (mistralError) {
      console.error('[PDF] Mistral OCR failed:', mistralError);
      // Fall back to pdf-parse
      console.log('[PDF] Falling back to pdf-parse...');
    }
  }

  // For large files or if Mistral failed, try pdf-parse
  try {
    console.log('[PDF] Using pdf-parse for extraction...');
    const pdfData = await parsePDF(pdfBuffer);

    const text = pdfData.text || '';
    const pageCount = pdfData.numpages || 1;

    console.log(`[PDF] Extracted ${text.length} characters from ${pageCount} pages`);

    if (text.length > 100) {
      return { text, pageCount };
    }

    // Very little text extracted
    return {
      text: '[This PDF appears to be image-based or has minimal extractable text. For best results, upload a text-based PDF or smaller file.]',
      pageCount,
    };
  } catch (error) {
    console.error('[PDF] pdf-parse also failed:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from PDF using Mistral OCR (for image-based PDFs)
 * Only works well with smaller files due to API limits
 */
async function extractTextFromPDFWithMistral(
  pdfBuffer: Buffer,
  filename: string
): Promise<{ text: string; pageCount: number }> {
  const client = getMistralClient();

  // Convert buffer to base64
  const base64 = pdfBuffer.toString('base64');
  const dataUri = `data:application/pdf;base64,${base64}`;

  try {
    const response = await client.chat.complete({
      model: 'pixtral-12b-2409',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              imageUrl: dataUri,
            },
            {
              type: 'text',
              text: `Extract ALL text from this PDF document. Return the complete text content, preserving structure where possible. Include all headings, paragraphs, bullet points, and table content. Do not summarize - extract everything.

Filename: ${filename}`,
            },
          ],
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    const text = typeof content === 'string' ? content : '';

    // Estimate page count (roughly 500 words per page)
    const wordCount = text.split(/\s+/).length;
    const pageCount = Math.max(1, Math.ceil(wordCount / 500));

    return { text, pageCount };
  } catch (error) {
    console.error('[MistralOCR] PDF extraction failed:', error);
    throw error;
  }
}

/**
 * Extract text from image using Mistral Vision
 */
export async function extractTextFromImage(
  imageBuffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const client = getMistralClient();

  // Convert buffer to base64
  const base64 = imageBuffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64}`;

  try {
    const response = await client.chat.complete({
      model: 'pixtral-12b-2409',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              imageUrl: dataUri,
            },
            {
              type: 'text',
              text: `Extract ALL text visible in this image. Return the complete text content.

Filename: ${filename}`,
            },
          ],
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content : '';
  } catch (error) {
    console.error('[MistralOCR] Image extraction failed:', error);
    throw error;
  }
}

/**
 * Detect document type from extracted text
 */
export function detectDocumentCategory(
  filename: string,
  text: string
): string {
  const filenameLower = filename.toLowerCase();
  const textLower = text.toLowerCase();

  // RFE documents
  if (
    filenameLower.includes('rfe') ||
    textLower.includes('request for evidence') ||
    textLower.includes('request for additional evidence')
  ) {
    if (
      textLower.includes('in response to') ||
      textLower.includes('response to rfe')
    ) {
      return 'rfe_response';
    }
    return 'rfe_original';
  }

  // Exhibits
  if (
    filenameLower.includes('exhibit') ||
    filenameLower.includes('evidence')
  ) {
    return 'exhibit';
  }

  // Contracts / Deal Memos
  if (
    filenameLower.includes('contract') ||
    filenameLower.includes('agreement') ||
    filenameLower.includes('deal') ||
    filenameLower.includes('memo') ||
    textLower.includes('terms of employment') ||
    textLower.includes('compensation') ||
    textLower.includes('itinerary')
  ) {
    return 'contract';
  }

  // Support letters
  if (
    filenameLower.includes('letter') ||
    filenameLower.includes('support') ||
    textLower.includes('to whom it may concern') ||
    textLower.includes('letter of support')
  ) {
    return 'support_letter';
  }

  // Awards
  if (
    filenameLower.includes('award') ||
    filenameLower.includes('certificate') ||
    textLower.includes('certificate of') ||
    textLower.includes('award for')
  ) {
    return 'award';
  }

  // Media
  if (
    filenameLower.includes('article') ||
    filenameLower.includes('press') ||
    filenameLower.includes('media') ||
    textLower.includes('published') ||
    textLower.includes('newspaper') ||
    textLower.includes('magazine')
  ) {
    return 'media';
  }

  // Legal brief / petition
  if (
    filenameLower.includes('brief') ||
    filenameLower.includes('petition') ||
    textLower.includes('petitioner') ||
    textLower.includes('beneficiary') ||
    textLower.includes('8 cfr')
  ) {
    return 'legal_document';
  }

  return 'other';
}
