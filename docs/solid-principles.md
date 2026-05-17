# SOLID principles — mapped to this repository

Detailed module notes: [`docs/capstone/PHASE2_SOLID_COURSE_MODULE.md`](capstone/PHASE2_SOLID_COURSE_MODULE.md).

---

## Single Responsibility Principle (SRP)

| Concern | Where separated |
|---------|-----------------|
| Course **construction** vs **persistence** vs **HTTP** | `CourseBuilder.js` · `CourseRepository.js` · `instructorRoutes.js` |
| **Grading rules** vs **transport** | `GradingStrategy.js` vs instructor router handlers |

---

## Open/Closed Principle (OCP)

| Extension | Mechanism |
|-----------|-----------|
| New report formats | Add class implementing bridge side in `ReportExporter.js` pattern |
| New grading scheme | Add `GradingStrategy` implementation; register in context |
| Cached reads | `CachedCourseRepository` **decorates** port without editing inner repo |

---

## Liskov Substitution Principle (LSP)

| Contract | Substitutes |
|----------|-------------|
| `CourseRepository` async contract | `CachedCourseRepository` honors same surface for decorator wrapping |

---

## Interface Segregation Principle (ISP)

| Client | Depends on |
|--------|------------|
| Student UI / routes | Student-only endpoints; no admin/instructor-only imports required |
| Instructor | Authoring + grading surfaces scoped to **owned** courses |

---

## Dependency Inversion Principle (DIP)

| Abstraction | Concrete |
|-------------|----------|
| `CourseRepositoryPort` (application) | `CourseRepository` + decorator composed in `createLmsApp.js` |

**Outcome:** High-level policy does not import low-level SQLite/memory details directly in route files.

---

## Foundational OOP (rubric)

| Principle | LMS mapping |
|-----------|-------------|
| **Encapsulation** | `InMemoryStore.withWrite` serializes mutations; JWT verification hidden in middleware |
| **Abstraction** | Repository **port** hides persistence; `UserProfile` public DTO vs internal store |
| **Inheritance** | `StudentProfile`, `InstructorProfile`, `AdminProfile` extend shared `UserProfile` semantics (via factory + shared shape) |
| **Polymorphism** | `GradingContext` swaps strategies; role profiles handled uniformly at boundaries |

---

## Files to cite in viva

- `backend/src/patterns/builder/CourseBuilder.js`
- `backend/src/infrastructure/CourseRepository.js`
- `backend/src/application/CourseRepositoryPort.js`
- `backend/src/patterns/strategy/GradingStrategy.js`
- `backend/src/patterns/bridge/ReportExporter.js`
