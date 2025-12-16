/**
 * Client-side Supabase client for browser uploads
 */

import { createClient } from '@supabase/supabase-js';

// Create a client-side Supabase client
// These are public keys, safe to expose in browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload file directly to Supabase Storage from browser
 */
export async function uploadFileToStorage(
  file: File,
  sessionId: string,
  onProgress?: (progress: number) => void
): Promise<{ path: string; error: string | null }> {
  const fileId = crypto.randomUUID();
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100);

  const storagePath = `scoring/${sessionId}/${fileId}_${sanitizedName}`;

  // Upload with progress tracking using XMLHttpRequest
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ path: storagePath, error: null });
      } else if (xhr.status === 403 || xhr.status === 401) {
        resolve({ path: '', error: 'Storage authentication failed. Please ensure the storage bucket policies are configured correctly.' });
      } else {
        resolve({ path: '', error: `Upload failed with status ${xhr.status}` });
      }
    });

    xhr.addEventListener('error', () => {
      resolve({ path: '', error: 'Upload failed - network error' });
    });

    // Build the upload URL
    const uploadUrl = `${supabaseUrl}/storage/v1/object/scoring-documents/${storagePath}`;

    xhr.open('POST', uploadUrl);
    xhr.setRequestHeader('Authorization', `Bearer ${supabaseAnonKey}`);
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.send(file);
  });
}

/**
 * Simple upload using Supabase client (no progress, but simpler)
 */
export async function uploadFileSimple(
  file: File,
  sessionId: string
): Promise<{ path: string; error: string | null }> {
  const fileId = crypto.randomUUID();
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100);

  const storagePath = `scoring/${sessionId}/${fileId}_${sanitizedName}`;

  const { error } = await supabaseClient.storage
    .from('scoring-documents')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    // Provide more helpful error messages for common issues
    if (error.message.includes('row-level security') || error.message.includes('security policy')) {
      return { path: '', error: 'Storage policy error. Please run the storage bucket migration (003_storage_bucket.sql).' };
    }
    if (error.message.includes('Bucket not found')) {
      return { path: '', error: 'Storage bucket not found. Please run the storage bucket migration (003_storage_bucket.sql).' };
    }
    return { path: '', error: error.message };
  }

  return { path: storagePath, error: null };
}
