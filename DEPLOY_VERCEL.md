# Deploy to Vercel Pro - Migration Guide

This guide covers migrating the USCIS Officer Scoring Tool from Netlify to Vercel Pro.

## Why Vercel Pro?

- **Native Next.js support** - Vercel created Next.js, best optimization
- **Longer function timeouts** - Up to 5 minutes on Pro (vs 10s on Hobby)
- **Better caching** - ISR and edge caching built-in
- **Serverless functions** - Better cold start times
- **Built-in analytics** - Web Vitals tracking

## Prerequisites

1. Vercel Pro account ($20/month per member)
2. GitHub repo connected
3. Environment variables ready

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

## Step 2: Create vercel.json

Already created in this branch. Key settings:

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

This sets 5-minute timeout for all API routes.

## Step 3: Environment Variables

Set these in Vercel Dashboard > Project > Settings > Environment Variables:

### Required
```
ANTHROPIC_API_KEY=sk-ant-api03-xxx
MISTRAL_API_KEY=xxx
NEXT_PUBLIC_SUPABASE_URL=https://ucjedsdqyzqbkjqxeqfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

### For Background Jobs (Inngest)
```
INNGEST_EVENT_KEY=xxx
INNGEST_SIGNING_KEY=xxx
```

### Optional
```
OPENAI_API_KEY=sk-xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SENDGRID_API_KEY=SG.xxx
```

## Step 4: Deploy

### Option A: Via CLI
```bash
vercel --prod
```

### Option B: Via GitHub
1. Go to vercel.com/new
2. Import GitHub repo: IGTA-Tech/uscis-officer-scoring-tool
3. Select "deploy/vercel-pro" branch
4. Add environment variables
5. Deploy

## Step 5: Configure Domain

1. Vercel Dashboard > Project > Settings > Domains
2. Add `xtraordinaryscoring.com`
3. Update DNS:
   - Remove Netlify DNS records
   - Add Vercel's CNAME: `cname.vercel-dns.com`

## Step 6: Update Inngest

1. Go to Inngest Dashboard
2. Update the app URL to your new Vercel URL
3. Sync the functions

## Step 7: Verify

1. Test file upload with large PDF
2. Check Inngest dashboard for function runs
3. Verify scoring completes

## Rollback Plan

If issues occur:
1. Revert DNS to Netlify
2. Netlify deployment is still active

## File Changes in This Branch

1. `vercel.json` - Vercel configuration
2. `DEPLOY_VERCEL.md` - This guide

## Estimated Migration Time

- Setup: 15 minutes
- DNS propagation: Up to 48 hours (usually 1-2 hours)
- Testing: 30 minutes

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
