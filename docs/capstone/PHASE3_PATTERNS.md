# Phase 3 — Design patterns integrated (6+)

| Pattern | Category | Location | Problem solved | Outcome |
|---------|----------|----------|----------------|---------|
| Singleton | Creational | `backend/src/patterns/singleton/AppConfig.js` | Single source for ports/secrets/TTL | One configuration object reused by middleware and composition root |
| Factory | Creational | `backend/src/patterns/factory/UserFactory.js` | Constructing the correct profile type | HTTP layer stays unaware of concrete profile classes |
| Builder | Creational | `backend/src/patterns/builder/CourseBuilder.js` | Courses have many optional fields | Fluent API prevents half-built aggregates |
| Adapter | Structural | `backend/src/patterns/adapter/LegacyEmailAdapter.js` | Vendor API shape differs from internal sender | Notifications can integrate legacy SDKs safely |
| Bridge | Structural | `backend/src/patterns/bridge/ReportExporter.js` | Multiple export targets | Swap HTML/JSON exporters without touching orchestrator |
| Decorator | Structural | `backend/src/patterns/decorator/CachedCourseRepository.js` | Hot read paths need TTL cache | Transparent caching without forking repository code |
| Observer | Behavioral | `backend/src/patterns/observer/DomainEvents.js` | Submission should fan out to notifications | Decouples grading/submission workflow from side effects |
| Strategy | Behavioral | `backend/src/patterns/strategy/GradingStrategy.js` | Multiple grading schemes | Instructor grading endpoint selects strategy per payload |
| State | Behavioral | `backend/src/patterns/state/AssignmentSubmissionState.js` | Illegal lifecycle jumps | Explicit transitions for draft → submitted |

Each file begins with a short comment block describing intent to aid reviewers and capstone assessors.
