# Developer Learning Platform

## Vision

Build a hands-on engineering learning platform where developers improve by
doing realistic software-engineering work inside simulated companies.

The goal is NOT to teach programming through traditional courses.

The goal is to simulate the situations engineers actually encounter:

- Reviewing pull requests
- Debugging bugs
- Investigating production incidents
- Understanding unfamiliar codebases
- Designing systems
- Working with databases
- Testing
- Security
- Working effectively with AI-generated code

The experience should feel like being an engineer at a real software company.

---

## Core Philosophy

1. Learn by doing.
2. Realistic engineering problems over artificial puzzles.
3. Professional realism comes before gamification.
4. AI should augment the experience, not replace engineering judgment.
5. Deterministic systems should establish ground truth whenever possible.
6. Users should understand WHY something is correct or incorrect.
7. Start narrow and build depth before breadth.

---

## Initial Product

The first experience is a PR Review Trainer.

A user joins a fictional software company and receives a realistic pull
request associated with a ticket.

They inspect:

- The ticket
- Existing code
- The PR diff
- Tests
- Relevant documentation
- Existing architecture

They submit review comments.

The platform evaluates their review and explains:

- Issues they found
- Important issues they missed
- Incorrect concerns
- Quality of reasoning
- What they should learn from the exercise

---

## Initial Technology

Frontend:
- React
- TypeScript

Backend:
- Java
- Spring Boot
- Gradle

Database:
- PostgreSQL

Development:
- Docker
- Git

Deployment will initially target AWS, but infrastructure should remain simple.

---

## Initial Domain

Start with ONE fictional company.

The company should have a small but realistic Java/Spring backend.

Example:

A fintech/e-commerce/SaaS company with:
- 1–3 services
- PostgreSQL
- REST APIs
- Authentication
- Background jobs/events where useful

Do NOT build a huge microservice architecture initially.

---

## AI Philosophy

AI will eventually help generate:

- Pull requests
- Bugs
- Tickets
- Scenario variations
- Fictional coworker comments
- Hints
- Explanations
- Feedback

However:

AI must NOT be the ultimate source of truth for whether an engineering
decision is correct.

Scenario definitions and deterministic tests should establish the expected
behavior whenever possible.

AI can interpret and evaluate reasoning, but important technical claims
should be grounded in the actual codebase, tests, architecture, or explicit
scenario metadata.

---

## Gamification

Gamification should support learning rather than turn engineering into a
mobile game.

Eventually include:

- XP
- Levels
- Skill categories
- Difficulty
- Achievements
- Streaks
- Leaderboards

Target roughly:

80% professional simulation
20% game layer

---

## Product Modes

DevLair will eventually support two separate product modes.

- **Learning mode** is the primary product. It uses the Sidekick Supply Co.
  world, Kilo, contextual guidance, retryable practice, and detailed teaching
  feedback to help an individual developer build practical engineering skill.
- **Assessment mode** is a future employer-facing product. It will use neutral
  presentation, standardized scenarios and scoring, time controls, accessible
  candidate workflows, and integrity safeguards. It must not expose learning
  hints or corrected code during an assessment.

Assessment mode is not part of the MVP. DevLair should first prove that its
learning scenarios are useful and engaging before attempting hiring signals.

---

## Learning Flow

Each capability should use a short, repeatable learning loop:

1. Kilo, the learner's senior developer, explains the product context and the relevant part of the simulated
   codebase.
2. The learner completes a realistic engineering task without the tutorial
   covering the work area.
3. The platform gives a grounded debrief explaining what was found, missed, or
   outside automatic assessment.
4. When a new capability is introduced, Kilo begins a new focused tutorial
   section before the learner tries that activity.

The onboarding is therefore not one giant lecture. It is a sequence of small
context → practice → debrief sections as DevLair grows.

For the PR Review Trainer, practice means writing review comments against
proposed code. Editing code is deliberately out of scope for that activity.
Direct code changes and test verification belong in future debugging and
implementation-focused tasks.

## PR Review Difficulty Ladder

PR review tasks use four authoring levels. Foundation tasks teach one direct
rule with limited files and one or two deterministic findings. Core tasks add
several related files, a read-only supporting dependency, two or three findings,
and a benign distractor. Advanced tasks require evidence from several layers of
the system. Expert tasks involve explicit tradeoffs across areas such as
security, reliability, data, performance, or API behavior. Every level must
remain deterministically assessable.

After the first guided Foundation tutorial, help is optional and progressive:
a process nudge, then a context nudge, then an investigation question. Using a
hint does not reduce learning evidence. The first runnable store experience is
deferred until read-only codebase context and a Core task prove their value.

## Work PC, Home, and Progress

Learning mode opens as the learner's Sidekick Supply Co. work PC. Its company
browser keeps Today as the compact employee dashboard, GitGrub as the pull
request tool, and named tabs for open PRs. Today offers current work, a small
company inbox, and a snapshot of evidence earned from completed tasks. Tasks
are the top-level units of practice; tickets, pull requests, logs, and future
incident artifacts live inside the relevant task rather than becoming separate
pretend applications.

Skill evidence is based on deterministic prepared findings in the scenarios a
learner has completed. It is useful feedback for learning, not a universal
engineering score or a leaderboard rating. Desk decorations are meaningful
earned mementos only: there is no currency, shop, loot box, or paid gameplay
advantage.

## Fictional Company Direction

Sidekick Supply Co. is a scrappy equipment-manufacturing subsidiary supporting
the superhero league's B-tier heroes. It builds and maintains the practical,
uncelebrated gear that lets those heroes do their jobs. The learner works on the
engineering systems behind that operation as a normal software developer. Kilo
Vale is their senior developer. Superhero details belong in company products,
customers, and optional future easter eggs, not in the learner's role or core
engineering terminology.

---

## Long-Term Roadmap

1. PR Review Trainer
2. Gamification and progression
3. AI-powered scenario generation/evaluation
4. Debugging challenges
5. Production incidents
6. Persistent simulated company
7. AI-era engineering scenarios
8. Multiple companies/domains
9. Multiple technology stacks
10. System design, databases, security, DevOps/SRE and architecture tracks

---

## Important Constraints

Do not prematurely build:

- Multiple companies
- Multiple programming languages
- A huge microservice architecture
- A full GitHub/Jira/Slack clone
- A fake operating system, monitoring screen, or storefront without a learning
  task behind it
- An integrated AI coding assistant
- Complicated infrastructure
- A massive gamification system

Build the smallest version that proves the core experience is fun and useful.
