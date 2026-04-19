# Phase 2 — SOLID design for course management (instructor module)

## Single Responsibility (SRP)

- `CourseBuilder` only assembles aggregates.
- `CourseRepository` only reads/writes course aggregates in the store.
- `createInstructorRouter` wires HTTP concerns without embedding persistence rules.

## Open / Closed (OCP)

- New export formats are added by implementing another `ReportExporter` bridge implementation without editing orchestration logic.
- Cached reads are added via `CachedCourseRepository` decorator instead of editing the repository class.

## Liskov Substitution (LSP)

- `CourseRepository` honors the async contract expected by `CachedCourseRepository`, so either implementation can be substituted in tests.

## Interface Segregation (ISP)

- Student controllers depend only on catalog/enrollment endpoints; instructors depend on ownership-scoped routes; admins never import course authoring ports.

## Dependency Inversion (DIP)

- Application code depends on `CourseRepositoryPort` abstraction; concrete `CourseRepository` + `CachedCourseRepository` are composed in `server.js`.

## Annotated flow (instructor create)

1. HTTP body validated in route handler (minimal).
2. `CourseBuilder.withBasics(...).build(id)` produces the aggregate.
3. `InMemoryStore.withWrite` persists atomically relative to the demo process.

This keeps high-level policy (who may create) near the router while construction mechanics stay reusable.
