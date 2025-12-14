/**
 * Mistral OCR Client for PDF and Image Text Extraction
 */

import { Mistral } from '@mistralai/mistralai';

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
 * Extract text from PDF using Mistral OCR
 */
export async function extractTextFromPDF(
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
    const pageCount = Math.ceil(wordCount / 500);

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
