# Development Guide

This document explains how DevLair runs locally and records the tools added as
the project grows.

## How We Build

DevLair is also a learning project. Development happens in small vertical
checkpoints: introduce one concept, connect it to the system, implement it,
verify it, and document the result. Explanations should use plain language and
show how a request or data item travels between the frontend, API, and database.

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

JPA/Hibernate maps Java entity classes to those Flyway-created tables. The
application uses repositories such as `LearnerUserRepository` for common data
access rather than writing every SQL query by hand.

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
Browser form -> controller -> service/repository -> PostgreSQL
                                      |
                                      -> session cookie after a successful login
```

## Current Verification

```powershell
cd server; .\gradlew.bat test
cd client; npm run build
```

Backend tests currently use an in-memory H2 database so they run without Docker.
Local development and production use PostgreSQL.
