-- Usage Tracking for Free/Paid Scorings
-- Run this in Supabase SQL Editor

-- Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255),
    free_scorings_used INTEGER DEFAULT 0,
    paid_scorings_remaining INTEGER DEFAULT 0,
    subscription_active BOOLEAN DEFAULT false,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    last_scoring_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scoring Events Log
CREATE TABLE IF NOT EXISTS scoring_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint VARCHAR(64),
    session_id UUID REFERENCES scoring_sessions(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_fingerprint ON usage_tracking(fingerprint);
CREATE INDEX IF NOT EXISTS idx_usage_stripe_customer ON usage_tracking(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_events_fingerprint ON scoring_events(fingerprint);
CREATE INDEX IF NOT EXISTS idx_events_session ON scoring_events(session_id);

-- Update trigger
CREATE TRIGGER usage_tracking_updated_at
    BEFORE UPDATE ON usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
