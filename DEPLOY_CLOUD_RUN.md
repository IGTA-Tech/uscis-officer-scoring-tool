# Deploy to Google Cloud Run - Migration Guide

This guide covers migrating the USCIS Officer Scoring Tool from Netlify to Google Cloud Run.

## Why Cloud Run?

- **Long request timeouts** - Up to 60 minutes (vs 10s on Netlify)
- **Automatic scaling** - Scale to zero when idle, scale up under load
- **Full container control** - Run any Node.js code without serverless limitations
- **Cost efficient** - Pay only for actual request time
- **No cold start issues** - Minimum instances keep service warm

## Prerequisites

1. Google Cloud account with billing enabled
2. `gcloud` CLI installed and configured
3. Docker installed locally (for testing)
4. GitHub repo connected (optional, for CI/CD)

## Step 1: Install and Configure gcloud

```bash
# Install gcloud CLI (macOS)
brew install google-cloud-sdk

# Or download from https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 2: Update next.config.js

Add standalone output mode for smaller container:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... existing config
}
```

## Step 3: Build and Test Locally

```bash
# Build Docker image
docker build -t uscis-scoring-tool .

# Run locally with env vars
docker run -p 8080:8080 \
  -e ANTHROPIC_API_KEY=sk-ant-xxx \
  -e MISTRAL_API_KEY=xxx \
  -e NEXT_PUBLIC_SUPABASE_URL=https://ucjedsdqyzqbkjqxeqfu.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJxxx \
  uscis-scoring-tool

# Test at http://localhost:8080
```

## Step 4: Deploy to Cloud Run

### Option A: Manual Deploy

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/uscis-scoring-tool

# Deploy to Cloud Run
gcloud run deploy uscis-scoring-tool \
  --image gcr.io/YOUR_PROJECT_ID/uscis-scoring-tool \
  --region us-central1 \
  --platform managed \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --concurrency 80 \
  --min-instances 0 \
  --max-instances 10 \
  --allow-unauthenticated
```

### Option B: Using Cloud Build (CI/CD)

```bash
# Trigger build from cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml
```

### Option C: GitHub Actions

Create `.github/workflows/deploy-cloud-run.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_CREDENTIALS }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/uscis-scoring-tool
          gcloud run deploy uscis-scoring-tool \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/uscis-scoring-tool \
            --region us-central1 \
            --platform managed
```

## Step 5: Set Environment Variables

```bash
# Set secrets in Cloud Run
gcloud run services update uscis-scoring-tool \
  --region us-central1 \
  --set-env-vars "ANTHROPIC_API_KEY=sk-ant-xxx" \
  --set-env-vars "MISTRAL_API_KEY=xxx" \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=https://ucjedsdqyzqbkjqxeqfu.supabase.co" \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx" \
  --set-env-vars "SUPABASE_SERVICE_ROLE_KEY=eyJxxx"
```

Or use Google Secret Manager for sensitive values:

```bash
# Create secrets
echo -n "sk-ant-xxx" | gcloud secrets create anthropic-api-key --data-file=-
echo -n "xxx" | gcloud secrets create mistral-api-key --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding anthropic-api-key \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Mount secrets in Cloud Run
gcloud run services update uscis-scoring-tool \
  --region us-central1 \
  --set-secrets "ANTHROPIC_API_KEY=anthropic-api-key:latest"
```

## Step 6: Configure Custom Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service uscis-scoring-tool \
  --domain xtraordinaryscoring.com \
  --region us-central1

# Get DNS records to configure
gcloud run domain-mappings describe \
  --domain xtraordinaryscoring.com \
  --region us-central1
```

Update your DNS:
- Add the CNAME or A records shown in the output
- Wait for SSL certificate provisioning (automatic)

## Step 7: Configure Inngest

Update Inngest to use your Cloud Run URL:

1. Go to Inngest Dashboard
2. Update app URL to `https://uscis-scoring-tool-HASH-uc.a.run.app`
3. Or use your custom domain once configured

## Step 8: Verify Deployment

```bash
# Get service URL
gcloud run services describe uscis-scoring-tool \
  --region us-central1 \
  --format 'value(status.url)'

# Check logs
gcloud run services logs read uscis-scoring-tool --region us-central1

# Test the endpoint
curl https://YOUR_SERVICE_URL/api/health
```

## Configuration Files in This Branch

1. `Dockerfile` - Multi-stage build for Next.js
2. `.dockerignore` - Files to exclude from container
3. `cloudbuild.yaml` - Cloud Build configuration
4. `DEPLOY_CLOUD_RUN.md` - This guide

## Recommended Settings

| Setting | Value | Reason |
|---------|-------|--------|
| Memory | 2Gi | PDF processing needs memory |
| CPU | 2 | Parallel processing |
| Timeout | 3600s | Long-running scoring jobs |
| Min Instances | 0 | Cost savings when idle |
| Max Instances | 10 | Handle burst traffic |
| Concurrency | 80 | Requests per instance |

## Cost Estimate

Cloud Run pricing (us-central1):
- vCPU: $0.00002400/vCPU-second
- Memory: $0.00000250/GiB-second
- Requests: $0.40/million

Example: 1000 scoring requests/month, 2 min avg:
- CPU: 1000 × 120s × 2 vCPU × $0.000024 = $5.76
- Memory: 1000 × 120s × 2 GiB × $0.0000025 = $0.60
- Total: ~$6.50/month (plus egress)

## Rollback Plan

1. Revert DNS to Netlify
2. Netlify deployment is still active
3. Or deploy previous Cloud Run revision:
   ```bash
   gcloud run services update-traffic uscis-scoring-tool \
     --to-revisions PREVIOUS_REVISION=100 \
     --region us-central1
   ```

## Troubleshooting

### Container won't start
```bash
# Check build logs
gcloud builds list --limit 5
gcloud builds log BUILD_ID

# Check container logs
gcloud run services logs read uscis-scoring-tool --region us-central1
```

### Request timeout
- Increase timeout: `--timeout 3600`
- Check if processing is truly stuck vs just slow

### Memory issues
- Increase memory: `--memory 4Gi`
- Check for memory leaks in logs

## Support

- Cloud Run Docs: https://cloud.google.com/run/docs
- Next.js on Cloud Run: https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service
