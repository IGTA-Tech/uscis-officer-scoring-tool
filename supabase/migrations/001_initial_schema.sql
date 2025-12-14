-- USCIS Officer Scoring Tool - Database Schema
-- Run this in Supabase SQL Editor

-- Scoring Sessions
CREATE TABLE scoring_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('full_petition', 'rfe_response', 'exhibit_packet', 'contract_deal_memo')),
    visa_type VARCHAR(10) NOT NULL CHECK (visa_type IN ('P-1A', 'O-1A', 'O-1B', 'EB-1A')),
    beneficiary_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'scoring', 'completed', 'error')),
    progress INTEGER DEFAULT 0,
    progress_message TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Uploaded Files (supports 100MB+ chunked uploads)
CREATE TABLE uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES scoring_sessions(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    storage_path TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    extracted_text TEXT,
    word_count INTEGER,
    page_count INTEGER,
    document_category VARCHAR(50), -- rfe_original, rfe_response, exhibit, contract, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scoring Results
CREATE TABLE scoring_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES scoring_sessions(id) ON DELETE CASCADE UNIQUE,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    overall_rating VARCHAR(20) CHECK (overall_rating IN ('Approve', 'RFE Likely', 'Denial Risk')),
    approval_probability INTEGER,
    rfe_probability INTEGER,
    denial_risk INTEGER,
    criteria_scores JSONB,              -- Per-criterion breakdown
    evidence_quality JSONB,             -- Tier analysis
    rfe_predictions JSONB,              -- Predicted RFE topics
    weaknesses JSONB,
    strengths JSONB,
    recommendations JSONB,
    full_report TEXT,                   -- Complete markdown report
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat History (persistent)
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES scoring_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Research Results
CREATE TABLE research_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES scoring_sessions(id) ON DELETE CASCADE,
    research_type VARCHAR(50),          -- perplexity, gemini_rag
    query TEXT,
    results JSONB,
    sources_found INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_status ON scoring_sessions(status);
CREATE INDEX idx_sessions_created ON scoring_sessions(created_at DESC);
CREATE INDEX idx_files_session ON uploaded_files(session_id);
CREATE INDEX idx_results_session ON scoring_results(session_id);
CREATE INDEX idx_chat_session ON chat_messages(session_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at);
CREATE INDEX idx_research_session ON research_results(session_id);

-- Update trigger for scoring_sessions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scoring_sessions_updated_at
    BEFORE UPDATE ON scoring_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
