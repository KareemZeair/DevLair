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