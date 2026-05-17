# Design patterns — evaluation summary

Consolidated table for assessors. Canonical file paths: **`backend/src/patterns/**`**. Extended narrative: [`docs/capstone/PHASE3_PATTERNS.md`](../capstone/PHASE3_PATTERNS.md).

| Pattern | Location | Purpose | Problem solved |
|---------|----------|---------|----------------|
| **Singleton** | `patterns/singleton/AppConfig.js` | One shared configuration object | Scattered `process.env` reads and magic numbers |
| **Factory** | `patterns/factory/UserFactory.js` | Build correct profile subtype from user record | `switch`/role logic duplicated in HTTP layer |
| **Builder** | `patterns/builder/CourseBuilder.js` | Fluent assembly of course aggregates | Many optional course fields; telescoping constructors |
| **Adapter** | `patterns/adapter/LegacyEmailAdapter.js` | Isolate legacy email SDK shape | Vendor API ≠ internal notification interface |
| **Bridge** | `patterns/bridge/ReportExporter.js` | Decouple report orchestration from HTML/JSON | Large `if/else` per export format in routes |
| **Decorator (cache)** | `patterns/decorator/CachedCourseRepository.js` | Transparent TTL cache for hot reads | Duplicating repository for cache vs uncached |
| **Decorator (RBAC)** | `patterns/decorator/RoleGuardedHandlerDecorator.js` | Wrap handlers with role checks + `onAccess` audit hook | Cross-cutting policy without editing inner handler |
| **Observer** | `patterns/observer/DomainEvents.js` | Fan-out after submission / domain events | Tight coupling: route directly calling mailer |
| **Strategy** | `patterns/strategy/GradingStrategy.js` | Pluggable numeric vs rubric grading | Duplicated validation across separate endpoints |
| **State** | `patterns/state/AssignmentSubmissionState.js` | Guard illegal submission transitions | Boolean flags for lifecycle — error-prone |

---

## Per-pattern rationale (short)

### Singleton — AppConfig
**Why:** JWT secret, cache TTL, API prefix belong in one place.  
**Outcome:** Middleware and composition root read **one** instance.

### Factory — UserFactory
**Why:** Students, instructors, admins share concepts but differ in behavior.  
**Outcome:** Routes receive a **polymorphic** profile without construction logic.

### Builder — CourseBuilder
**Why:** Course creation has optional metadata.  
**Outcome:** **Fluent** API; invalid half-built courses avoided.

### Adapter — LegacyEmailAdapter
**Why:** External systems change shape over time.  
**Outcome:** Domain stays stable if SDK changes.

### Bridge — ReportExporter
**Why:** Admin reports may target HTML, JSON, PDF later.  
**Outcome:** New format = new implementation class, not route edits.

### Decorator — CachedCourseRepository
**Why:** Read-heavy catalog/course paths.  
**Outcome:** **OCP:** add caching without modifying core repository.

### Decorator — RoleGuardedHandlerDecorator
**Why:** Demonstrates **RBAC** as composable wrapper (assessment requirement).  
**Outcome:** Handler stays pure; policy is layered.

### Observer — DomainEvents
**Why:** Submission should trigger notifications without route knowing all subscribers.  
**Outcome:** **Loose coupling** for side effects.

### Strategy — Grading
**Why:** Institutions use numeric scales, rubrics, pass/fail.  
**Outcome:** **OCP:** add scheme without changing controller structure.

### State — Assignment workflow
**Why:** Draft vs submitted vs graded must be enforced.  
**Outcome:** Explicit transitions instead of ad-hoc flags.

---

## Cross-links

- Rubric table: [`docs/capstone/SUBMISSION_EVALUATION_GUIDE.md`](../capstone/SUBMISSION_EVALUATION_GUIDE.md)
- Tests proving Strategy: [`docs/testing/testing-guide.md`](../testing/testing-guide.md)
