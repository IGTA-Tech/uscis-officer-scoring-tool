# USCIS Officer Scoring Tool

A web application that evaluates visa petitions from the perspective of a senior USCIS adjudications officer. Get honest, critical feedback on your petition before you file.

## Features

- **Devil's Advocate Evaluation** - AI acts as a skeptical 15+ year USCIS officer
- **Multiple Document Types** - Score full petitions, RFE responses, exhibit packets, and contract deal memos
- **Multiple Visa Types** - Supports O-1A, O-1B, P-1A, and EB-1A
- **100MB+ File Support** - Handle large petition packages
- **Persistent Chat** - Ask follow-up questions about your score
- **RFE Predictions** - See likely RFE topics with probability estimates
- **Criterion-by-Criterion Analysis** - Detailed breakdown with officer concerns

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Claude (primary), OpenAI (fallback), Mistral (OCR)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Anthropic API key
- Mistral API key (for PDF OCR)
- Supabase project (optional but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/uscis-officer-scoring-tool.git
cd uscis-officer-scoring-tool
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your API keys in `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxx
MISTRAL_API_KEY=xxx
OPENAI_API_KEY=sk-xxx  # Optional fallback

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

5. Set up database (if using Supabase):
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/001_initial_schema.sql`
   - Create a storage bucket called `scoring-documents`

6. Start the development server:
```bash
npm run dev
```

7. Open http://localhost:3000

## Usage

1. **Upload Documents** - Click "Start Scoring" and upload your petition documents (PDF, images, or text files)
2. **Select Options** - Choose your document type and visa category
3. **Wait for Analysis** - The AI officer will review your documents
4. **Review Results** - See your overall score, criterion breakdown, and RFE predictions
5. **Chat with Officer** - Ask follow-up questions to understand the assessment

## Deployment to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

Or use the Netlify CLI:
```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload documents for scoring |
| `/api/score` | POST | Start scoring process |
| `/api/score` | GET | Get scoring results |
| `/api/chat` | POST | Send chat message |
| `/api/chat` | GET | Get chat history |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `MISTRAL_API_KEY` | Yes | Mistral API key for OCR |
| `OPENAI_API_KEY` | No | OpenAI fallback API key |
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | Supabase service role key |

*Supabase is optional but recommended for persistent storage

## Project Structure

```
uscis-officer-scoring-tool/
├── app/
│   ├── api/
│   │   ├── upload/route.ts       # File upload handler
│   │   ├── score/route.ts        # Scoring endpoint
│   │   └── chat/route.ts         # Chat with officer
│   ├── (dashboard)/
│   │   ├── scoring/new/          # New scoring form
│   │   └── scoring/[id]/         # Results + chat
│   ├── lib/
│   │   ├── ai/                   # AI clients
│   │   ├── scoring/              # Officer scoring engine
│   │   ├── database/             # Supabase client
│   │   └── types/                # TypeScript definitions
│   └── page.tsx                  # Landing page
├── RAG/                          # Visa knowledge base
├── supabase/migrations/          # Database schema
├── netlify.toml                  # Netlify config
└── package.json
```

## License

MIT

## Disclaimer

This tool provides AI-generated assessments for educational purposes only. It does not constitute legal advice. Always consult with a qualified immigration attorney before filing any visa petition.
