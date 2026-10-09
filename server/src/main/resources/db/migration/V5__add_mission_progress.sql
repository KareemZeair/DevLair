ALTER TABLE scenarios ADD COLUMN mission_type VARCHAR(40) NOT NULL DEFAULT 'PR_REVIEW';
ALTER TABLE scenarios ADD COLUMN difficulty VARCHAR(40) NOT NULL DEFAULT 'FOUNDATION';
ALTER TABLE scenarios ADD COLUMN company_area VARCHAR(100) NOT NULL DEFAULT 'Order operations';

ALTER TABLE review_findings ADD COLUMN skill_key VARCHAR(80) NOT NULL DEFAULT 'review-judgment';

UPDATE review_findings SET skill_key = 'security'
WHERE id = '40000000-0000-0000-0000-000000000001';
UPDATE review_findings SET skill_key = 'testing'
WHERE id = '40000000-0000-0000-0000-000000000002';
UPDATE review_findings SET skill_key = 'validation'
WHERE id = '40000000-0000-0000-0000-000000000003';
UPDATE review_findings SET skill_key = 'testing'
WHERE id = '40000000-0000-0000-0000-000000000004';

CREATE TABLE learner_scenario_skill_evidence (
    id UUID PRIMARY KEY,
    learner_user_id UUID NOT NULL REFERENCES learner_users(id),
    scenario_id UUID NOT NULL REFERENCES scenarios(id),
    skill_key VARCHAR(80) NOT NULL,
    best_score INTEGER NOT NULL CHECK (best_score >= 0 AND best_score <= 100),
    attempts INTEGER NOT NULL CHECK (attempts > 0),
    last_practiced_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE (learner_user_id, scenario_id, skill_key)
);
