-- Storage Bucket Setup for Direct Browser Uploads
-- Run this in Supabase SQL Editor

-- Create the storage bucket for scoring documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'scoring-documents',
    'scoring-documents',
    false,
    157286400, -- 150MB limit
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist (to allow re-running this migration)
DROP POLICY IF EXISTS "Allow anonymous uploads to scoring-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous reads from scoring-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access to scoring-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous updates to scoring-documents" ON storage.objects;

-- Allow anonymous uploads to the scoring-documents bucket
-- Files are organized by session: scoring/{sessionId}/{fileId}_{filename}
CREATE POLICY "Allow anonymous uploads to scoring-documents"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'scoring-documents');

-- Allow anonymous reads from the scoring-documents bucket
CREATE POLICY "Allow anonymous reads from scoring-documents"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'scoring-documents');

-- Allow service role full access (for background processing)
CREATE POLICY "Allow service role full access to scoring-documents"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'scoring-documents')
WITH CHECK (bucket_id = 'scoring-documents');

-- Allow anonymous updates (for upsert functionality)
CREATE POLICY "Allow anonymous updates to scoring-documents"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'scoring-documents')
WITH CHECK (bucket_id = 'scoring-documents');
