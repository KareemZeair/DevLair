# Development Guide

This document explains how DevLair runs locally and records the tools added as
the project grows.

## How We Build

DevLair is also a learning project. Development happens in small vertical
checkpoints: introduce one concept, connect it to the system, implement it,
verify it, and document the result. Explanations should use plain language and
show how a request or data item travels between the frontend, API, and database.

## Interface Direction

Product copy uses commas or periods instead of em dashes. Keep this convention
in all learner-facing frontend text.

The first learner flow deliberately has two visual modes. Milo's onboarding is
a Sidekick Supply Co. command-center tutorial: chat messages and choice buttons
spotlight the ticket, architecture rule, and pull request in sequence. The PR
review workspace is intentionally calmer and follows familiar developer-tool
patterns such as unified diffs and inline review comments. It is inspired by
common workflows, not copied GitHub branding or UI assets.

Registration validates email format and password length in the browser for
immediate feedback. Spring Boot validates the same request again on the server,
because browser checks improve usability but cannot be trusted for security.

The next visual-polish items live in `TODO.md`. Planned motion and Milo
notifications must respect operating-system reduced-motion settings; sound must
be optional. These are accessibility requirements, not cosmetic extras.

Milo's tutorial is divided into sections, not delivered as one long lecture.
Each section gives context for one capability, lets the learner try it, then
returns feedback before a future feature begins its own focused tutorial.

The current PR Review Trainer is read-only by design. A learner comments on
proposed lines, then submits all ready comments together for evaluation. Later
debugging and implementation missions will provide editable code and tests,
because modifying code is a different skill from reviewing it.

## Heroic Operations UI

The frontend has a small design system of CSS custom properties (variables).
Names such as `--hq-gold` and `--review-paper` describe a role rather than one
screen, so the same rule can safely serve welcome, onboarding, and feedback.
Changing `data-theme` on the document switches those values between light and
dark themes; the selected theme is stored in browser local storage.

`OperationsShell` is a shared React wrapper for non-code screens. It provides
the original comic-book Supply HQ background, truthful active-objective HUD, and
theme control. `MiloMessenger` is the lower-right guide popup. Browser security
requires a user interaction before audio can play, so its visual alert always
works and the gentle Web Audio chime is attempted only after a new learner
action. Learners can mute it, and CSS disables non-essential motion when the
operating system requests reduced motion.

The map-room and Milo images in `client/public/assets/` are original
project-owned generated artwork. They deliberately stay outside the neutral PR
diff surface: code uses compact monospace type, line numbers, and conventional
added/removed colors because readability wins during an engineering task. The
small `JavaCodeLine` component adds only basic keyword, string, comment, and
number color—not a full editor dependency—so learners get IDE-like scanning
help without hiding how the diff itself works.

Review findings can also carry a scenario-author-written `recommended_code`
snippet. Flyway stores it with the deterministic finding, Spring exposes it in
feedback, and the debrief places it beside the exact submitted lines. The panels
start compact for scanning, but a learner can enlarge a comparison when studying
it. This keeps teaching examples concrete without asking the browser or an AI model to invent
a correction.

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

## Current Verification

```powershell
docker compose up -d
cd server; .\gradlew.bat test
cd server; .\gradlew.bat bootRun
cd client; npm test
cd client; npm run build
cd client; npm run dev
```

Backend tests currently use an in-memory H2 database so they run without Docker.
Local development uses PostgreSQL.

Manual path for the first learner flow:

1. Start Docker Desktop, then `docker compose up -d`.
2. Run the API with `.\gradlew.bat bootRun` from `server/`. Confirm the logs
   show Flyway applying V1 and V2, then `Started DevlairApiApplication`.
3. Run `npm run dev` from `client/` and open http://localhost:5173.
4. Create an account, walk through Milo’s tour, open PR #184.
5. Comment on the new `getOrderDetails` method (proposed lines 13–15 in
   `OrderService.java`) about missing customer scope.
6. Submit. Feedback should list that HIGH finding as found and the test finding
   as missed unless you also commented on the test file around lines 10–19.

Client and server Dockerfiles wait until this flow is solid.
