CREATE TABLE learner_users (
    id UUID PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE scenarios (
    id UUID PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500) NOT NULL
);

CREATE TABLE scenario_documents (
    id UUID PRIMARY KEY,
    scenario_id UUID NOT NULL REFERENCES scenarios(id),
    document_type VARCHAR(40) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE scenario_files (
    id UUID PRIMARY KEY,
    scenario_id UUID NOT NULL REFERENCES scenarios(id),
    path VARCHAR(500) NOT NULL,
    original_content TEXT NOT NULL,
    proposed_content TEXT NOT NULL,
    UNIQUE (scenario_id, path)
);

CREATE TABLE review_findings (
    id UUID PRIMARY KEY,
    scenario_id UUID NOT NULL REFERENCES scenarios(id),
    file_path VARCHAR(500) NOT NULL,
    start_line INTEGER NOT NULL CHECK (start_line > 0),
    end_line INTEGER NOT NULL CHECK (end_line >= start_line),
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    explanation TEXT NOT NULL
);

CREATE TABLE review_submissions (
    id UUID PRIMARY KEY,
    learner_user_id UUID NOT NULL REFERENCES learner_users(id),
    scenario_id UUID NOT NULL REFERENCES scenarios(id),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE review_comments (
    id UUID PRIMARY KEY,
    review_submission_id UUID NOT NULL REFERENCES review_submissions(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    line_number INTEGER NOT NULL CHECK (line_number > 0),
    body TEXT NOT NULL
);
