# Roadmap

## Current status

Phase 1 is in progress. The first learner can register, complete Milo’s tour, open the seeded PR, leave line comments, and receive deterministic found/missed feedback. A full dashboard, extra scenarios, and app Dockerfiles are still later work.

The near-term interface-polish work is tracked in `TODO.md`, including bespoke
Milo art, motion, dark mode, and the popup-guide direction.

The primary product remains learning mode. A separate employer assessment mode
is a later possibility, only after the learning loop and scenario quality have
been proven.

---

## Phase 1 — PR Review MVP

Goal:

A developer can open a realistic PR and submit a code review.

### Features

- User accounts
- Dashboard
- Scenario list
- Scenario detail
- Ticket/context
- PR diff
- Code browsing
- Review comments
- Review submission
- Basic evaluation
- Feedback
- Basic progress tracking

### Technical

- React frontend
- Spring Boot backend
- PostgreSQL
- Docker
- One Java/Spring fictional company
- Small realistic codebase

---

## Phase 2 — Progression

- XP
- Levels
- Skill categories
- Difficulty
- Achievements
- Streaks
- Basic leaderboard

---

## Phase 3 — AI Scenarios

- AI-assisted scenario generation
- PR variations
- Ticket generation
- Scenario context
- AI-assisted evaluation
- Hints
- Explanations
- Fictional coworker comments

AI-generated scenarios must still be validated against deterministic ground truth.

---

## Phase 4 — Debugging

Users receive a broken system.

They have access to:

- Code
- Logs
- Stack traces
- Tests
- Git history
- Reproduction information

They must:

1. Identify the problem
2. Determine the root cause
3. Implement a fix
4. Verify the fix

---

## Phase 5 — Production Incidents

Simulate being on call.

Users investigate:

- Alerts
- Logs
- Metrics
- Traces
- Deployments
- Recent changes
- Service dependencies

They resolve the incident and write a postmortem.

---

## Phase 6 — Persistent Company

Turn the individual exercises into one connected company.

Potential interfaces:

- GitHub-like repository
- Jira-like tickets
- Slack-like communication
- Deployments
- Releases
- Incidents

User decisions have consequences.

Example:

Bad PR review
→ bug reaches production
→ incident occurs
→ user investigates
→ postmortem

---

## Phase 7 — AI-Era Engineering

Scenarios involving AI-generated code.

Users practice:

- Reviewing AI-generated code
- Detecting hallucinations
- Verifying AI claims
- Finding subtle bugs
- Testing AI-generated implementations
- Knowing when NOT to use AI

Users may use external tools such as ChatGPT, Claude, Cursor, or Copilot.

---

## Phase 8 — Expansion

Eventually add:

- Multiple companies
- E-commerce
- Fintech
- SaaS
- Media
- Python
- TypeScript/Node
- Go
- .NET
- System design
- SQL/database challenges
- Security
- DevOps
- SRE
- Architecture

---

## Future Product Mode: Employer Assessment

This is intentionally not scheduled before the learning platform is proven.

- Neutral, distraction-light assessment presentation
- Standardized role-relevant scenarios and scoring rubrics
- Time controls, accessibility support, candidate reports, and integrity work
- No tutorial hints, corrected-code debriefs, or game-style interruption while
  an assessment is in progress

This mode complements algorithm practice platforms. It should measure practical
engineering judgment, not attempt to become a LeetCode replacement first.
