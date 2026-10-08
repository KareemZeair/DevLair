# Architecture Decisions

This file records important decisions so future development does not
accidentally contradict earlier decisions.

---

## ADR-001 — Start with Java/Spring

Decision:

The first simulated company uses Java/Spring.

Reason:

The creator is already comfortable with Java and Spring, allowing the project
to focus on realistic engineering scenarios instead of learning another stack.

Future stacks can be added later.

---

## ADR-002 — One Company First

Decision:

The MVP contains one fictional company.

Reason:

A single coherent codebase allows scenarios to build on each other and
eventually become a persistent simulation.

---

## ADR-003 — Deterministic Ground Truth

Decision:

Important scenario outcomes should be deterministic whenever possible.

AI should not independently decide whether a technical issue exists.

Reason:

AI can produce plausible but incorrect technical reasoning.

The platform needs reliable evaluation.

---

## ADR-004 — AI Behind the Scenes Initially

Decision:

The MVP will not contain an integrated AI coding assistant.

Users may use their preferred external AI tools.

The platform initially uses AI for scenario generation, variation, hints and
evaluation.

Reason:

This reduces complexity and teaches an important skill:

AI can generate code, but engineers must be able to judge it.

---

## ADR-005 — Realism Over Gamification

Decision:

Engineering scenarios should feel realistic before adding game mechanics.

Target approximately 80% professional simulation and 20% gamification.

---

## ADR-006 — Avoid Premature Microservices

Decision:

The learning platform itself should begin as a relatively simple application.

The simulated company may contain multiple services later, but we should not
introduce distributed-system complexity without a learning reason.

---

## ADR-007 — Small Vertical Slices

Decision:

Prefer completing small end-to-end features over building large layers in
isolation.

Example:

Scenario database
→ backend API
→ frontend scenario page
→ submission
→ evaluation
→ feedback

rather than building the entire backend before the frontend.

---

## ADR-008 — PostgreSQL Schema with Flyway, Application Data with JPA

Decision:

Use PostgreSQL as the application database. Flyway migrations define the
database schema and its versioned changes. Spring Data JPA with Hibernate maps
application Java objects to those tables for ordinary reads and writes.

Reason:

Flyway makes database changes explicit, reviewable, and reproducible. JPA keeps
the application code focused on meaningful domain objects rather than repeated
SQL boilerplate. Using both teaches and preserves the boundary between database
design and application persistence.

---

## ADR-010 — Flyway PostgreSQL Database Module

Decision:

Keep Flyway as the schema owner, and add `flyway-database-postgresql` beside the Flyway starter.

Reason:

From Flyway 10 onward, PostgreSQL support is not inside `flyway-core`. Without the database module, Spring Boot 4 does not run migrations before Hibernate validates the schema, so the API fails with missing tables against an empty database.

---

## ADR-011 — Vite Dev Proxy for Same-Origin Sessions

Decision:

During local development, the React dev server proxies `/api` to Spring Boot on port 8080.

Reason:

Session cookies and CSRF cookies then belong to the same origin as the UI (`localhost:5173`). That avoids a CORS setup for the first learner flow. Dockerfiles for the client and server still wait until this flow works.

---

## ADR-009 — Containerize PostgreSQL First

Decision:

During early development, run React and Spring Boot directly from their native
development tools. Use Docker Compose to run PostgreSQL locally.

Reason:

This keeps frontend and backend debugging straightforward while providing a
repeatable local database. Dockerfiles for the client and server can follow
after the first end-to-end learning flow works.

---

## ADR-012 — Guided Onboarding, Familiar Review Workspace

Decision:

Use a two-mode interface. First-run onboarding uses Milo's scripted chat and
guided spotlights to explain the product, simulated company, and relevant
codebase. Each new capability follows a focused context → practice → debrief
section rather than extending one uninterrupted tutorial. The pull-request
review workspace uses familiar developer-tool patterns: a PR header, truthful
tabs, unified diffs, inline comments, and review submission.

Reason:

The tutorial should lower the entry barrier and make the fictional company feel
alive. The actual review work should remain credible and recognizable to
developers without copying GitHub branding or visual trade dress.

---

## ADR-014 — Keep PR Review and Code-Fix Practice Separate

Decision:

The PR Review Trainer asks learners to inspect proposed code and leave review
comments; it does not offer direct code editing. Future debugging or
implementation missions will give learners a failing system, editable code,
tests, and a verification step.

Reason:

Code review and implementation are distinct engineering skills. Keeping the
first mission focused makes the expected action clear and lets later exercises
teach safe code changes and test-driven verification properly.

---

## ADR-013 — Milo as an Optional Popup Guide

Decision:

Use Milo Vale, a warm and slightly goofy operations guide, in a compact
lower-right popup rather than a permanent side panel.
New messages will use a subtle visual notification and an optional sound. The
guide must be dismissible, must not cover code or review controls, and must
respect reduced-motion and muted-sound preferences.

Reason:

The tutorial should feel alive without reducing the working space needed for
code review. Optional, accessible notifications preserve learner control.

---

## ADR-015 — Comic-Book Supply HQ Presentation

Decision:

Non-code screens use original 2D comic-book Supply HQ art: a scrappy B-tier
hero-equipment subsidiary with warm city-view mission control. Code review
surfaces remain neutral and developer-tool-like for readability.

Reason:

The world needs a memorable, ownable personality without compromising the
realistic review practice that is DevLair's core learning activity.

---

## ADR-016 - Separate Learning and Assessment Modes

Decision:

DevLair's initial and primary product is a learner-facing engineering simulator.
It may later add a separate employer assessment mode, but it must not mix
tutorial guidance, corrected-code feedback, or game-style interruptions into a
timed or scored assessment.

Reason:

Learning benefits from a welcoming world, retries, and explanations. Hiring
assessment needs standardized conditions, neutral presentation, accessible
workflows, and trustworthy scoring. Treating these as separate modes protects
both goals and avoids building assessment infrastructure before the learning
product is proven.
