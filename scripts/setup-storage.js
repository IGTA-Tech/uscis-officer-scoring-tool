#!/usr/bin/env node
/**
 * Setup Supabase Storage bucket and policies
 * Run: node scripts/setup-storage.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure .env.local has valid Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function setupStorage() {
  console.log('Setting up Supabase Storage bucket...\n');

  // 1. Create or update the bucket
  console.log('1. Creating/updating scoring-documents bucket...');
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket('scoring-documents', {
    public: false,
    fileSizeLimit: 157286400, // 150MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
  });

  if (bucketError) {
    if (bucketError.message.includes('already exists')) {
      console.log('   Bucket already exists, updating...');
      const { error: updateError } = await supabase.storage.updateBucket('scoring-documents', {
        public: false,
        fileSizeLimit: 157286400,
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp'
        ]
      });
      if (updateError) {
        console.error('   Failed to update bucket:', updateError.message);
      } else {
        console.log('   Bucket updated successfully');
      }
    } else {
      console.error('   Failed to create bucket:', bucketError.message);
      process.exit(1);
    }
  } else {
    console.log('   Bucket created successfully');
  }

  // 2. Apply RLS policies via SQL
  console.log('\n2. Applying RLS policies...');
  console.log('   Note: RLS policies must be applied via SQL Editor in Supabase Dashboard');
  console.log('   or via the migration file: supabase/migrations/003_storage_bucket.sql\n');

  const sqlInstructions = `
-- Run this SQL in Supabase Dashboard > SQL Editor:

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous uploads to scoring-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous reads from scoring-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access to scoring-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous updates to scoring-documents" ON storage.objects;

-- Allow anonymous uploads
CREATE POLICY "Allow anonymous uploads to scoring-documents"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'scoring-documents');

-- Allow anonymous reads
CREATE POLICY "Allow anonymous reads from scoring-documents"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'scoring-documents');

-- Allow service role full access
CREATE POLICY "Allow service role full access to scoring-documents"
ON storage.objects FOR ALL TO service_role
USING (bucket_id = 'scoring-documents')
WITH CHECK (bucket_id = 'scoring-documents');

-- Allow anonymous updates (for upsert)
CREATE POLICY "Allow anonymous updates to scoring-documents"
ON storage.objects FOR UPDATE TO anon
USING (bucket_id = 'scoring-documents')
WITH CHECK (bucket_id = 'scoring-documents');
`;

  console.log(sqlInstructions);

  // 3. Test upload
  console.log('3. Testing upload capability...');
  const testFile = Buffer.from('test');
  const testPath = `test/${Date.now()}_test.txt`;

  const { error: uploadError } = await supabase.storage
    .from('scoring-documents')
    .upload(testPath, testFile, { contentType: 'text/plain' });

  if (uploadError) {
    console.log('   Test upload failed:', uploadError.message);
    console.log('   This is expected if RLS policies are not yet applied.\n');
  } else {
    console.log('   Test upload successful!');
    // Clean up test file
    await supabase.storage.from('scoring-documents').remove([testPath]);
    console.log('   Test file cleaned up.\n');
  }

  console.log('Done! If test upload failed, run the SQL above in Supabase Dashboard.');
}

setupStorage().catch(console.error);
