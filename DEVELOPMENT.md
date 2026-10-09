# Development Guide

This document explains how DevLair runs locally and records the tools added as
the project grows.

## How We Build

DevLair is also a learning project. Development happens in small vertical
checkpoints: introduce one concept, connect it to the system, implement it,
verify it, and document the result. Explanations should use plain language and
show how a request or data item travels between the frontend, API, and database.

We also use a Lean Startup build-measure-learn loop for product decisions. For
each meaningful feature, first write the learner problem and a small testable
hypothesis. Build only the smallest useful version, decide what learner behavior
or outcome would validate it, then review the evidence before expanding it.
For example, Home's hypothesis is that clear current work and
visible learning evidence help a learner return to realistic practice. A useful
signal is whether learners open and complete a second task, not how often
they click decorative UI. This protects the core learning product from feature
excitement and gives us a concrete reason to keep, revise, or remove a feature.

## Interface Direction

Product copy uses commas or periods instead of em dashes. Keep this convention
in all learner-facing frontend text.

The first learner flow deliberately has two visual modes. Kilo's onboarding is
a Sidekick Supply Co. command-center tutorial: chat messages and choice buttons
spotlight the ticket, architecture rule, and pull request in sequence. The PR
review workspace is intentionally calmer and follows familiar developer-tool
patterns such as unified diffs and inline review comments. It is inspired by
common workflows, not copied GitHub branding or UI assets.

Registration validates email format and password length in the browser for
immediate feedback. Spring Boot validates the same request again on the server,
because browser checks improve usability but cannot be trusted for security.

The next visual-polish items live in `TODO.md`. Planned motion and Kilo
notifications must respect operating-system reduced-motion settings; sound must
be optional. These are accessibility requirements, not cosmetic extras.

Kilo's tutorial is divided into sections, not delivered as one long lecture.
Each section gives context for one capability, lets the learner try it, then
returns feedback before a future feature begins its own focused tutorial.

The current PR Review Trainer is read-only by design. A learner comments on
proposed lines, then submits all ready comments together for evaluation. Later
debugging and implementation tasks will provide editable code and tests,
because modifying code is a different skill from reviewing it.

## Heroic Operations UI

The frontend has a small design system of CSS custom properties (variables).
Names such as `--hq-gold` and `--review-paper` describe a role rather than one
screen, so the same rule can safely serve welcome, onboarding, and feedback.
Changing `data-theme` on the document switches those values between light and
dark themes; the selected theme is stored in browser local storage.

`OperationsShell` is a shared React wrapper for non-code screens. It provides
the original comic-book Supply HQ background, truthful active-objective HUD, and
theme control. `KiloMessenger` is the lower-right senior-developer popup. Browser security
requires a user interaction before audio can play, so its visual alert always
works and the gentle Web Audio chime is attempted only after a new learner
action. Learners can mute it, and CSS disables non-essential motion when the
operating system requests reduced motion.

The map-room and Kilo images in `client/public/assets/` are original
project-owned generated artwork. They deliberately stay outside the neutral PR
diff surface: code uses compact monospace type, line numbers, and conventional
added/removed colors because readability wins during an engineering task. The
small `JavaCodeLine` component adds only basic keyword, string, comment, and
number color, not a full editor dependency, so learners get IDE-like scanning
help without hiding how the diff itself works.

Review findings can also carry a scenario-author-written `recommended_code`
snippet. Flyway stores it with the deterministic finding, Spring exposes it in
feedback, and the debrief places it beside the exact submitted lines. The panels
start compact for scanning, but a learner can enlarge or vertically resize a
single unified diff when studying it. Submitted code appears in red with a minus
marker, followed by green corrected code with a plus marker. This keeps teaching
examples concrete without asking the browser or an AI model to invent
a correction.

The first two seeded tasks deliberately teach different review skills in the
same fictional Java codebase. PR #184 is about protecting customer-owned order
data. PR #211 is about validating replacement quantities before inventory side
effects happen and proving that guard with a negative-path test. After a debrief,
the learner can start the next available task. This is a small navigation step,
not a dashboard or progression system.

## Workplace Tasks and Skill Evidence

`DesktopShell` is the authenticated application wrapper. On a large screen it
shows the persistent left rail; on a small screen the same four destinations
move into a bottom bar. This is navigation, not four separate apps: a task
still opens one focused workspace where the ticket, architecture context, and
pull request belong together.

`GET /api/workspace` combines existing scenario data with the signed-in
learner's submissions and skill evidence. When a review is submitted, Spring
first evaluates it against the scenario's deterministic findings. It then
records the best result for each skill represented by those findings. Flyway
migration V5 adds the task metadata, the finding skill label, and the
`learner_scenario_skill_evidence` table that makes this durable across browser
sessions.

The percentage is intentionally narrow. It means how completely the learner
identified prepared findings for that skill in a task. It does not claim to
measure every part of engineering ability, and it is not a leaderboard score.
This restraint matters while there are only two missions. Future ranking must
wait for enough calibrated scenario data and must use a learner's first scored
attempt before the debrief, so replaying a known answer cannot create an unfair
advantage.

### Scenario Context and Optional Help

Flyway V7 extends a scenario with a structured pull-request description,
ordered optional hints, and file roles. A changed file has a before and after
version and appears in the review diff. A context file is unchanged supporting
source code, so the UI exposes it through the read-only Codebase tab instead of
allowing comments on it. This is a useful distinction: engineers inspect lots
of unchanged code while reviewing, but their comments normally belong to the
proposed change.

Hints are authored with the deterministic scenario data rather than generated
on the fly. The UI reveals them one at a time only when a learner clicks Need
help. Because learning mode rewards asking good questions, hint use does not
reduce skill evidence. The first two PRs remain Foundation tasks; the next PR
must be Core level and exercise the codebase explorer before a runnable store
or more complex simulation is built.

## Current Structure

```text
client/  React and TypeScript browser application
server/  Java and Spring Boot API
compose.yaml  Local PostgreSQL service definition
```

## Tools and Their Roles

### Gradle

Gradle is the Java build tool. It downloads declared Java libraries, compiles
the server, runs tests, and starts Spring Boot.

```powershell
cd server
.\gradlew.bat test
.\gradlew.bat bootRun
```

### Spring Boot

Spring Boot turns Java classes into a web application. Controllers receive HTTP
requests, services hold business rules, and repositories read or save data.

### PostgreSQL and Docker Compose

PostgreSQL stores durable application data. Docker Compose gives each developer
a repeatable local PostgreSQL instance without manually installing or
configuring it.

On Windows, Docker Desktop's Linux-container engine requires WSL 2 and the
Virtual Machine Platform Windows feature. Docker Desktop cannot start containers
until those prerequisites are enabled and Windows has restarted.

```powershell
docker compose up -d
docker compose down
```

`up -d` starts the database in the background. Its Docker volume preserves data
between restarts. `docker compose down -v` also deletes that local data and is
only appropriate when a fresh development database is wanted.

### Start the Full Local App

From the repository root, use one command to start the database, API, and
browser application:

```powershell
.\start-dev.ps1
```

The launcher starts PostgreSQL through Docker Compose, the Spring Boot API on
port 8080, and Vite on port 5173. It opens `http://localhost:5173` once both
services are listening. It deliberately refuses to stop a process already using
port 5173 or 8080, because that process may belong to another application. Its
background logs are stored in the ignored `.devlair/` directory.

If PowerShell blocks a locally checked-out script, run it for this session with:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start-dev.ps1
```

### Flyway and JPA

Flyway migration files in `server/src/main/resources/db/migration` define the
database tables and seeded development data. They run in version order when the
server starts against PostgreSQL.

Spring Boot 4 needs two Flyway pieces on the classpath: the Flyway starter and
`flyway-database-postgresql`. The second module is what teaches Flyway how to
talk to Postgres. Without it, Hibernate can try to validate tables that Flyway
has not created yet.

JPA/Hibernate maps Java entity classes to those Flyway-created tables. The
application uses repositories such as `LearnerUserRepository` for common data
access rather than writing every SQL query by hand.

The local database user matches Compose: database `devlair`, user `devlair`,
password `devlair`. Those values are in `server/src/main/resources/application.properties`.

### Registration and Sessions

`POST /api/auth/register` creates a learner account. The password is processed
with BCrypt, a one-way hash: the database stores the hash rather than the
password itself.

`POST /api/auth/login` verifies a learner's email and password. On success,
Spring Security creates a server-side session and the browser receives a cookie
containing only a random session identifier. On later requests, the browser
sends that cookie and Spring Security uses it to identify the learner. The
password is not repeatedly sent after login.

The path is:

```text
Browser form -> Vite `/api` proxy -> controller -> service/repository -> PostgreSQL
                                      |
                                      -> session cookie after a successful login
```

Before any form submission, the React app calls `GET /api/csrf` to obtain a
token. Mutating requests then send the `X-XSRF-TOKEN` header copied from
the `XSRF-TOKEN` cookie. That is CSRF protection for cookie sessions: a random
site cannot submit a review using the learner's browser cookie alone.

`GET /api/scenarios` lists scenarios. `GET /api/scenarios/{slug}` returns the
ticket, architecture note, files, and a line diff. Seeded findings stay on the
server until `POST /api/scenarios/{slug}/reviews`, which stores the comments and
compares them to those findings by file path and line range.

## Simulated Work PC and Preferences

The signed-in UI now has a client-side work-PC shell. It wraps existing React
views and API calls rather than creating another backend system. Today is the
dashboard and GitGrub is the pull-request tool. Opening a task still loads the
same scenario endpoint and submitting a review uses the same deterministic
evaluation endpoint.

The desktop remembers window placement, open tabs, the active tab, and
preferences with `localStorage`. This is deliberately local-only convenience
state, not account data. A browser can clear it at any time, and the app
validates saved values before using them. Fullscreen is different: the browser Fullscreen API requires
a learner click and browsers do not allow an app to restore it automatically.

Settings centralize three preferences: system/day/night appearance, Kilo alert
sound, and motion. The system appearance choice follows the device preference;
reduced motion also respects the operating system setting. On small screens the
window manager becomes a full-screen workspace because dragging windows on a
phone is not useful.

## Current Verification

```powershell
.\start-dev.ps1
cd server; .\gradlew.bat test
cd client; npm test
cd client; npm run build
```

Backend tests currently use an in-memory H2 database so they run without Docker.
Local development uses PostgreSQL.

Manual path for the first learner flow:

1. Start Docker Desktop, then run `.\start-dev.ps1` from the repository root.
   Confirm the script reports that DevLair is ready at http://localhost:5173.
2. The launcher waits for the API to start. Its backend log should show Flyway
   applying migrations, then `Started DevlairApiApplication`.
3. Open http://localhost:5173 if the browser did not open automatically.
4. Create an account, walk through Kilo’s tour, open PR #184.
5. Comment on the new `getOrderDetails` method (proposed lines 13–15 in
   `OrderService.java`) about missing customer scope.
6. Submit. Feedback should list that HIGH finding as found and the test finding
   as missed unless you also commented on the test file around lines 10–19.

Client and server Dockerfiles wait until this flow is solid.
