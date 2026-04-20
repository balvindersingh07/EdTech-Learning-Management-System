# Phase 6 — Testing, observability, and packaging

## Mock-based unit tests

- `npm test` runs Vitest against:
  - `backend/tests/gradingStrategy.test.js` — **Strategy** pattern (`NumericGradingStrategy`, `RubricGradingStrategy`) without Express.
  - `backend/tests/api.smoke.test.js` — HTTP smoke tests (health, public catalog, admin login + stats) against `createLmsApp()` with a **resettable in-memory** store (`resetLmsBackendForTests()`).

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

## Persistence (Prisma + snapshot)

- **Schema:** `prisma/schema.prisma` — `User` (with `accountStatus`) and **`AppStateSnapshot`** (single row `id = 1`, JSON `payload` of the full LMS graph).
- **Runtime:** `InMemoryStore.exportState()` / `fromExportedState()` serialize users, courses, assignments, submissions, notifications, activity, platform directory, custom subjects, and enrollments.
- **Standalone API:** `node backend/src/server.js` calls `initLmsBackend(prisma)` then `createLmsApp()`. After every successful `store.withWrite`, the snapshot is **upserted** to SQLite so data survives process restarts.
- **Vite dev:** still uses **in-memory seed only** (no Prisma in the dev middleware path) for fast HMR.
- **Commands:** `npm run db:generate` · `npm run db:migrate` (or `migrate deploy` in CI).

## Instructor analytics (API-backed)

- **`GET /api/v1/instructor/reports/summary`** — counts courses, assignments, submissions, grading backlog, plus per-course enrollment bars for the signed-in instructor (`backend/src/interfaces/http/instructorRoutes.js`).
- **UI:** `src/pages/reports/InstructorReportsPage.tsx` consumes the endpoint (no dummy chart series).

## Packaging

- Frontend: `npm run build` produces `dist/`.
- Backend: `node backend/src/server.js` (Prisma snapshot on) or compose alongside `npm run dev:web` for split processes.
