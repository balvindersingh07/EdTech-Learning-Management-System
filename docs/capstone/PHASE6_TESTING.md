# Phase 6 — Testing, observability, and packaging

## Mock-based unit tests

- `npm test` runs Vitest against `backend/tests/gradingStrategy.test.js`.
- Tests exercise the **Strategy** pattern (`NumericGradingStrategy`, `RubricGradingStrategy`) without booting Express.

## Strategy usage in product code

- Instructor grading endpoint selects numeric vs rubric strategies before persisting scores (`GradingContext` in `backend/src/patterns/strategy/GradingStrategy.js`).

## Decorator pattern — role-based access (RBAC)

- **`RoleGuardedHandlerDecorator`** (`backend/src/patterns/decorator/RoleGuardedHandlerDecorator.js`) wraps an Express handler with an explicit allowed-role set and an **`onAccess` hook** (allow/deny + path + role). Demonstrates the **Decorator** pattern for RBAC without editing the inner handler.
- **Demonstration route:** `GET /api/v1/admin/activity` composes the decorator around the activity list handler (`backend/src/interfaces/http/adminRoutes.js`). Router still uses `requireRole("admin")` for defense in depth; the decorator shows how the same policy can wrap a reusable delegate (e.g. when extracting use-cases from route files).

## Structural decorator (cache) — recap

- **`CachedCourseRepository`** — TTL cache around course reads (`backend/src/patterns/decorator/CachedCourseRepository.js`).

## Observability (request metrics)

- **`requestLogger`** middleware (`backend/src/interfaces/http/middleware/requestLogger.js`) logs one **JSON line per response** with `method`, `path`, `role`, `status`, `ms`. Registered in `createLmsApp.js` after `express.json()`.
- **Next hardening (production):** replace `console.log` with Pino/Winston, add `x-request-id`, and export OTLP traces (see Phase 4 architecture notes).

## Persistence note (Prisma)

- SQLite + Prisma schema and migrations live under `prisma/`; `npm run db:generate` / `npm run db:migrate` align the DB with the domain model. Backend business logic still uses `InMemoryStore` until a later step wires Prisma into repositories.

## Packaging

- Frontend: `npm run build` produces `dist/`.
- Backend: `node backend/src/server.js` (compose alongside `npm run dev:web` or use the combined `npm run dev` script with `concurrently`).
