# Phase 6 — Testing, observability, and packaging

## Mock-based unit tests

- `npm test` runs Vitest against `backend/tests/gradingStrategy.test.js`.
- Tests exercise the **Strategy** pattern (`NumericGradingStrategy`, `RubricGradingStrategy`) without booting Express.

## Strategy usage in product code

- Instructor grading endpoint selects numeric vs rubric strategies before persisting scores (`GradingContext` in `backend/src/patterns/strategy/GradingStrategy.js`).

## Decorator / RBAC observability hooks (next steps)

- Add structured logging middleware (Singleton logger) to emit JSON lines per request: `{ role, route, latencyMs }`.
- Forward logs to OpenTelemetry for trace correlation IDs.

## Packaging

- Frontend: `npm run build` produces `dist/`.
- Backend: `node backend/src/server.js` (compose alongside `npm run dev:web` or use the combined `npm run dev` script with `concurrently`).
