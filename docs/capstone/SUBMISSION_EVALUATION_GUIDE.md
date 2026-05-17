# Evaluation criteria ↔ project (report & video)

Use with **written report** and **10–12 min** recording. See also [`docs/patterns/design-patterns.md`](../patterns/design-patterns.md).

| Category | Weight | Where demonstrated |
|----------|--------|---------------------|
| **OOP Design** | 20% | Domain profiles, `UserFactory`, store encapsulation — `PHASE1`, `solid-principles.md` |
| **Design Patterns** | 20% | `PHASE3`, `design-patterns.md`, `backend/src/patterns/**` |
| **Advanced design** | 15% | Layered/hex notes — `architecture-overview.md`, `PHASE4` |
| **Anti-pattern refactoring** | 10% | `refactoring.md`, `PHASE5` |
| **Testability & performance** | 10% | `testing/testing-guide.md`, `PHASE6` |
| **Documentation & presentation** | 15% | `docs/**`, this repo `README.md` |
| **Innovation & clarity** | 10% | Admin flow, snapshot persistence, role-separated SPA |

### Pattern → problem (appendix for report)

| Pattern | Problem | Why it fits |
|---------|---------|-------------|
| Singleton | Config sprawl | One `AppConfig` |
| Factory | Role construction | `UserFactory` |
| Builder | Optional course fields | `CourseBuilder` |
| Adapter | Legacy email shape | `LegacyEmailAdapter` |
| Bridge | Multi-format reports | `ReportExporter` |
| Decorator (cache) | Hot reads | `CachedCourseRepository` |
| Decorator (RBAC) | Auth audit | `RoleGuardedHandlerDecorator` |
| Observer | Submission side effects | `DomainEvents` |
| Strategy | Grading schemes | `GradingStrategy` |
| State | Illegal transitions | `AssignmentSubmissionState` |

### Video outline (summary)

| Time | Focus |
|------|--------|
| 0:00–1:30 | Intro — SPA + Express, OOP + patterns goal |
| 1:30–3:30 | Actors & modules |
| 3:30–6:00 | OOP + SOLID (Factory, Builder, port) |
| 6:00–8:30 | Patterns table + one code pan |
| 8:30–10:00 | Architecture, cache, concurrency |
| 10:00–11:00 | Refactor + `npm test` |
| 11:00–11:30 | Challenges & future work |

Full scripts: [`../final-presentation/demo-script.md`](../final-presentation/demo-script.md).

### AOP note

No AspectJ-style framework; cross-cutting concerns use **middleware**, **decorator**, and **domain events**. State that honestly in viva.
