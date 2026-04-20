# Phase 5 — Refactoring and anti-pattern removal

## Smell 1 — Role entanglement (God route)

**Before:** A single `/app/courses` surface mixed student browsing, instructor authoring, and admin affordances, making RBAC easy to violate in the UI.

**After:** Routes are namespaced per persona (`/app/student/*`, `/app/instructor/*`, `/app/admin/*`) with `RoleGuard` redirects if a token’s role does not match the subtree.

**Justification:** Mirrors bounded contexts from DDD-lite thinking—each subtree can evolve independently and reduces accidental coupling in navigation.

## Smell 2 — Fat client mocks masquerading as services

**Before:** `courseService`/`assignmentService` silently toggled mock vs axios via environment flags, hiding integration defects.

**After:** Dedicated `student*`, `instructor*`, and `admin*` service modules call the real Express API through the Vite proxy.

**Metrics:** Higher confidence in contract tests, fewer hidden branches, clearer stack traces when the API misbehaves.

## Smell 3 — Duplicate grading responsibilities

**Before:** Admin users could reach instructor-only grading routes in the SPA.

**After:** Grading is only registered under `/app/instructor/assignments/:id/grade` and the backend enforces ownership with `InstructorProfile#ownsCourse`.

**Outcome:** Instructional integrity and auditability improve; admin remains on `/app/admin/*` surfaces.
