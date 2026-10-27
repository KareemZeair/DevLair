# Sidekick Supply Co.

This is the learner-visible baseline for Sidekick Supply Co., DevLair's first
fictional company. It is a small Java 17 / Spring Boot modular monolith, not a
second DevLair platform service.

## What works

Open `http://localhost:8081` after starting the application. The browser can
list products, add equipment to the demo cart, and check out. Checkout is one
database transaction: it locks inventory rows, reserves stock, simulates a
payment, creates an order, then clears the cart. A declined simulated payment
rolls all of those database changes back.

The current module boundaries are deliberately package-level: catalog, cart,
inventory, checkout, orders, and web. Accounts, discounts, notifications, and
deliberate training defects are explicitly later slices.

## Run locally

```powershell
docker compose up -d sidekick-postgres
cd sidekick-supply
..\server\gradlew.bat bootRun --args='--server.port=8081'
```

The module reuses DevLair's checked-in Gradle wrapper so there is one wrapper
version to maintain. Run its tests with `..\server\gradlew.bat test`.

## Learner and author separation

Everything in this module is learner-visible baseline code. Future intentional
defects, hidden tests, expected reasoning, and reference fixes must live in a
separate private author repository or access-controlled environment. A local
folder in this repository is not a security boundary and must not be described
as one.

## Learning plan

Start with [LEARNING_PLAN.md](LEARNING_PLAN.md). It tells you where the code
lives, how to run the baseline, and how to approach each two-week exercise
without spoiling future scenario answers.
