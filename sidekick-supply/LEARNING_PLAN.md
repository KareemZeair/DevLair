# Your Sidekick Supply Engineering Refresher

This is a challenge-first, two-week plan for a Java backend engineer. The
point is not to finish fast. It is to practise the work sequence used on a real
team: understand the system, form hypotheses, find evidence, make a small
change, verify it, and explain why it is safe.

Do not ask an AI to solve an exercise while you are doing it. Keep a short
investigation log instead. After you finish or genuinely cannot proceed, bring
your notes, tests, and patch for review.

## Before day 1

The application you will investigate is in `sidekick-supply/`. It is separate
from `server/`, which is DevLair's training-platform API. Start in this folder:

```powershell
cd C:\Users\karee\Desktop\Projects\DevLair
docker compose up -d sidekick-postgres
cd sidekick-supply
..\server\gradlew.bat test
..\server\gradlew.bat bootRun --args='--server.port=8081'
```

Then open `http://localhost:8081`. The checkout flow is:

```text
browser -> StorefrontController -> cart / checkout services -> JPA repositories -> PostgreSQL
                                                   |                  |
                                                   -> payment         -> inventory and orders
```

Use Git to protect your learning work. For each day, create a branch with a
neutral name such as `practice/day-03`. Do not reset or discard changes merely
to start another exercise. Commit your work or copy it to a safe branch first.

## How to work every day

1. Read only that day's brief.
2. Write an initial hypothesis before changing code.
3. Reproduce or inspect the behavior before proposing a fix.
4. Make the smallest change that resolves the evidence.
5. Add or improve a test that would have caught the problem.
6. Run the relevant tests, then rerun the whole module suite.
7. Complete [REFLECTION_TEMPLATE.md](REFLECTION_TEMPLATE.md) in your own
   private notes. Do not commit answers to learner-visible scenario materials.

Time-box investigation at roughly 90 minutes. If you are stuck, ask for the
next hint only, not a solution.

## The 14-day plan

| Day | Task | Type | Time | Status today |
| --- | --- | --- | --- | --- |
| 1 | Map the checkout path | Architecture investigation | 75 min | Ready now |
| 2 | Invalid field report | Bug investigation | 90 min | Needs isolated scenario pack |
| 3 | Failed checkout side effect | Transaction investigation | 90 min | Needs isolated scenario pack |
| 4 | Flash-sale stock mismatch | Concurrency investigation | 120 min | Needs isolated scenario pack |
| 5 | Sluggish order history | Performance investigation | 120 min | Needs isolated scenario pack |
| 6 | Equipment replacement PR | Pull-request review | 90 min | Needs isolated scenario pack |
| 7 | Operations handoff | Technical assessment | 90 min | Needs isolated scenario pack |
| 8 | Retry-created duplicate | API reliability | 120 min | Needs isolated scenario pack |
| 9 | Customer order exposure | Security investigation | 90 min | Needs isolated scenario pack |
| 10 | Works in tests, fails in Postgres | Integration testing | 120 min | Needs isolated scenario pack |
| 11 | Store service will not boot | Container diagnosis | 90 min | Needs isolated scenario pack |
| 12 | Sporadic reservation failures | Incident investigation | 120 min | Needs isolated scenario pack |
| 13 | Dispatch retry reliability | Design and implementation | 120 min | Needs isolated scenario pack |
| 14 | Unannounced operational issue | Final assessment | 120 min | Needs isolated scenario pack |

Only Day 1 is presented as ready because it uses the working baseline directly.
The later tasks must each be delivered as an independently reproducible learner
starting state. Their defects, evaluator tests, and reference answers cannot
live in this repository without spoiling the exercise. Their tickets below are
the curriculum, not a claim that the environments already exist.

## Day 1 — Map the checkout path

**Ticket:** Kilo needs a one-page onboarding note for a developer joining the
Checkout team. Explain what happens after the demo customer adds an item and
places an order.

**Start:** Run the app, add one product to the cart, then place an order. Use
browser network tools only after first following the Java request path.

**Deliverable:** A one-page diagram and notes that identify the HTTP endpoints,
controller, services, repositories, database tables, transaction boundary, and
what happens when payment is declined.

**Done when:** Another developer could use your diagram to name the first three
places to inspect when an order is missing or inventory appears wrong.

**Do not do:** Do not refactor code or read future challenge descriptions for
answers. The goal is a defensible system map, not a prettier diagram.

## Day 2 — Invalid field report

**Ticket:** A support agent reports that a replacement-equipment request with
an invalid quantity reached a downstream action. Reproduce the report, find the
boundary that should reject it, and make the behavior testable.

**Start when delivered:** Read the ticket, reproduce with the supplied request,
and inspect request validation, service rules, and side effects in that order.

**Deliverable:** A focused fix, a regression test, and a short explanation of
which layer owns the rule.

## Day 3 — Failed checkout side effect

**Ticket:** A customer sees a failed checkout but later cannot buy the same
equipment. Investigate the database state before and after the failure.

**Start when delivered:** Reproduce once, record the affected rows, then trace
the business operation as one unit of work.

**Deliverable:** A fix and integration test proving both the successful and
failure paths leave durable state consistent.

## Day 4 — Flash-sale stock mismatch

**Ticket:** During a promotion, available units become negative or more orders
are accepted than stock allows. The report includes concurrent request evidence.

**Start when delivered:** Build a repeatable concurrent test before changing
the implementation. State the race you believe is possible.

**Deliverable:** A concurrency-safe change, a reproducible test, and a short
trade-off note about the consistency and throughput choice.

## Day 5 — Sluggish order history

**Ticket:** Customer support reports that the order-history page slows sharply
for high-volume customers.

**Start when delivered:** Capture the endpoint behavior, inspect generated SQL
and query count, then use the provided realistic data volume.

**Deliverable:** Before/after evidence, a targeted data-access improvement, and
an explanation of the database work removed or indexed.

## Day 6 — Equipment replacement PR

**Ticket:** Review a proposed change that introduces an equipment replacement
workflow. Leave only comments you can justify from the ticket and codebase.

**Start when delivered:** Read the ticket, then the changed files, then only
the supporting context required to test each concern.

**Deliverable:** Review comments with severity, impact, evidence, and an
actionable recommendation. Do not implement the PR.

## Day 7 — Operations handoff

**Ticket:** You inherit an unfamiliar operational issue shortly before the
on-call handoff. You receive a system snapshot, a short incident note, and
limited time.

**Start when delivered:** Build a hypothesis list ranked by evidence, not by
how familiar the code looks.

**Deliverable:** A system explanation, investigation order, root-cause claim,
and verification plan. This is an assessment: do not request hints first.

## Day 8 — Retry-created duplicate

**Ticket:** Some clients retry a timed-out checkout request; finance sees two
charges or two orders for one customer action.

**Start when delivered:** Identify the request identity, retry boundary, and
which result must be stable across equivalent requests.

**Deliverable:** An idempotency design and implementation with tests for retry,
conflicting reuse, and failure behavior.

## Day 9 — Customer order exposure

**Ticket:** A customer believes they can view an order that belongs to another
customer.

**Start when delivered:** Reproduce with two supplied identities. Follow the
authorization context from the request into the query or service decision.

**Deliverable:** A security fix, an access-control regression test, and proof
that legitimate access still works.

## Day 10 — Works in tests, fails in Postgres

**Ticket:** A workflow passes mocked or in-memory tests but behaves differently
against the local PostgreSQL service.

**Start when delivered:** Identify what your current test double cannot model.
Run the targeted case against PostgreSQL before changing application code.

**Deliverable:** A database-backed integration test and a fix or documented
database-specific constraint.

## Day 11 — Store service will not boot

**Ticket:** A containerized Sidekick Supply deployment cannot connect to a
required dependency in a clean environment.

**Start when delivered:** Use container logs, inspected configuration, and
network/service names. Avoid changing random configuration values.

**Deliverable:** A corrected configuration, a concise diagnosis, and commands
that prove a fresh developer can start the service.

## Day 12 — Sporadic reservation failures

**Ticket:** Inventory reservations intermittently fail under a specified load
pattern. Logs and data snapshots are supplied.

**Start when delivered:** Build a timeline from evidence. Mark observations
separately from assumptions.

**Deliverable:** Root-cause explanation, reproducible trigger, focused fix, and
the observability signal that would have shortened the incident.

## Day 13 — Dispatch retry reliability

**Ticket:** A background order-dispatch workflow is fragile when its downstream
dependency is slow or unavailable.

**Start when delivered:** Identify the failure modes before proposing retries.
Ask what happens after timeout, duplicate delivery, and process restart.

**Deliverable:** A small reliability improvement, tests for the relevant
failure cases, and a design note naming remaining risks.

## Day 14 — Unannounced operational issue

**Ticket:** A new Sidekick Supply issue combines several earlier concepts. The
brief deliberately does not name the category.

**Start when delivered:** Work independently for the full time-box. Do not
request hints until you have an evidence-backed investigation log.

**Deliverable:** Your patch, tests, investigation log, root-cause explanation,
alternatives considered, and a short handoff note. Assessment is based on the
quality of reasoning and verification as well as whether the symptom disappears.

## What to send for review

When you finish an exercise, send only:

1. Your task branch or diff.
2. The commands and test results you ran.
3. Your completed reflection.
4. The one question you would ask a teammate if this were production.

That lets the review focus on your engineering judgment instead of handing you
the next answer.
