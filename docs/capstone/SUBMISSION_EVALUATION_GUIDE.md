# Evaluation criteria ↔ project (for report & video)

Use this when writing the **Project Report** and **10–12 min video**. Weights sum to **100**.

| Category | Weight | Where it is demonstrated | What to say in 1 sentence |
|----------|--------|----------------------------|---------------------------|
| **OOP Design** | 20% | Domain entities (`StudentProfile`, `InstructorProfile`, `AdminProfile`), `UserFactory`, encapsulation in store/middleware, UML in `PHASE1_DOMAIN.md` | Domain is modeled with clear roles, shared abstractions, and safe boundaries between HTTP and persistence. |
| **Design Patterns** | 20% | `PHASE3_PATTERNS.md` + `backend/src/patterns/**` (6+ required patterns implemented) | Each pattern maps to a real LMS problem (grading, RBAC, caching, notifications, course construction, config). |
| **Advanced design** | 15% | `PHASE4_ARCHITECTURE.md`, layered routers, `CachedCourseRepository`, `InMemoryStore.withWrite`, Prisma snapshot in `PHASE6_TESTING.md` | Layered/hex-style split; caching and async concurrency are shown in code + blueprint; microservices described as a **future** scale-out option (not required by brief “or”). |
| **Anti-pattern refactoring** | 10% | `PHASE5_REFACTORING.md` | God-route / mock-toggle smells removed with role-scoped routes and real API services. |
| **Testability & performance** | 10% | `backend/tests/*.test.js`, Vitest, Strategy tests without Express, HTTP smoke tests | Unit tests with mocks where appropriate; smoke tests lock API contracts; performance story = cache + stateless JWT + snapshot persistence. |
| **Documentation & presentation** | 15% | `docs/capstone/PHASE*.md`, this file, pattern table below, code comments in pattern files | Phases document requirements → design → patterns → architecture → refactor → testing; diagrams in Mermaid where noted. |
| **Innovation & clarity** | 10% | Admin approval flow, prefixed catalog (`lms-*`), Prisma snapshot persistence, role-separated SPA | Clear product story: governance + teaching separation, demo-friendly but production-minded notes. |

### AOP note (Advanced Design Concepts)

The rubric mentions **AOP**. This codebase does **not** use a dedicated AOP framework (e.g. AspectJ-style). **Cross-cutting concerns** are handled by:

- **Middleware** (`authMiddleware`, `requestLogger`, `requireRole`)
- **Decorator** for RBAC (`RoleGuardedHandlerDecorator`)
- **Observer** for side effects after domain events  

In the report, state honestly: *“AOP-style separation of cross-cutting concerns is approximated via Express middleware and the Decorator pattern; a full aspect framework was out of scope.”*

---

## Final submission checklist (against institute list)

| Required item | Status | Where |
|---------------|--------|--------|
| Project report: Overview + problem | You write narrative | Use `PHASE1` + LMS module list |
| UML class diagrams | Partially in Mermaid | `PHASE1_DOMAIN.md` — add/export static diagram if PDF requires |
| SOLID + OOP explanation | Done | `PHASE2` + code references |
| Patterns + diagrams + justification | Done | `PHASE3` + table in this doc |
| Architecture (MVC / microservices) | Layered + notes | `PHASE4` — add **one** diagram showing optional microservices split as *future* |
| Anti-patterns + refactor | Done | `PHASE5` |
| Testability, concurrency, performance notes | Done | `PHASE6` + `PHASE4` |
| Code repository modular | **Logical** modules | Folders are `backend/src/interfaces`, `patterns`, `domain`, `infrastructure` — **not** literally `users/` at repo root. In the report, include a **“logical module map”** table (Users → auth + admin routes; Courses → builder + repo; etc.). |
| README | Added | `README.md` at repo root |
| Video 10–12 min | You record | Use script below |
| **Pattern → problem mapping table** | Below + `PHASE3` | Copy into report appendix |

---

## Video walkthrough script (~11 min)

| Time | Rubric section | What to show |
|------|------------------|--------------|
| 0:00–1:30 | Intro | SPA + Express API; goal = maintainable modular LMS; OOP + patterns focus |
| 1:30–3:30 | Problem & scope | Actors: student, instructor, admin; modules: users, courses, assignments, grading, notifications, reports |
| 3:30–6:00 | OOP + SOLID | Open `UserFactory`, profiles, `CourseBuilder`, `CourseRepositoryPort` / DIP; one slide on encapsulation (`withWrite`, JWT) |
| 6:00–8:30 | **Patterns (important)** | Table from `PHASE3` or below; quick code pan: `GradingStrategy`, `RoleGuardedHandlerDecorator`, `DomainEvents`, `CachedCourseRepository` |
| 8:30–10:00 | Architecture & scale | Layer diagram; cache pseudo-flow; `withWrite` concurrency; mention Prisma snapshot for standalone API |
| 10:00–11:00 | Refactor + testing | `PHASE5` before/after; run `npm test` in terminal; mention trade-offs (snapshot vs normalized DB) |
| 11:00–11:30 | Challenges & future | E2E optional; microservices optional; normalized Prisma optional |

---

## Pattern → problem → why it fits → alternatives

| Pattern | Problem it solves | Why it fits LMS | Alternatives considered |
|---------|-------------------|------------------|-------------------------|
| **Singleton** | Global config scattered | One `AppConfig` for JWT, API prefix, cache TTL | Passing `process.env` everywhere; **rejected** (fragile) |
| **Factory** | Role-specific construction | `UserFactory` builds correct profile from user record | Large switch in every route; **rejected** |
| **Builder** | Optional course fields / half-built objects | `CourseBuilder` fluent assembly | Telescoping constructor; **rejected** |
| **Adapter** | External notification/email shape | `LegacyEmailAdapter` isolates vendor shape | Direct SDK calls in domain; **rejected** |
| **Bridge** | Multiple report/export formats | `ReportExporter` + HTML/JSON implementations | If/else per format in admin route; **rejected** |
| **Decorator (cache)** | Hot reads without forking repo | `CachedCourseRepository` wraps port | Copy-paste repository; **rejected** |
| **Decorator (RBAC)** | Cross-cutting auth audit | Wraps handler with roles + `onAccess` | Only middleware; less composable for extracted use-cases |
| **Observer** | Submission triggers notifications | `domainEvents` decouples workflow | Direct calls from student route to mailer; **rejected** (tight coupling) |
| **Strategy** | Numeric vs rubric grading | `GradingContext` swaps strategy per request | Two separate endpoints with duplicated validation; **rejected** |
| **State** | Illegal submission transitions | `AssignmentWorkflow` guards lifecycle | Boolean flags only; **rejected** (error-prone) |

---

## Likely follow-up interview — short answers

1. **Why this pattern vs another?** — Example: Strategy over long `if/else` keeps grading **open for new schemes** without editing the controller (OCP).
2. **SOLID in your design?** — SRP: routers vs repositories vs builders; DIP: `CourseRepositoryPort`; OCP: new exporter implements bridge interface.
3. **Scale with new features?** — Add use-case modules behind ports; horizontal API replicas; replace snapshot with normalized services per bounded context.
4. **Trade-offs?** — Snapshot persistence = fast capstone delivery vs normalized DB = better query/reporting at scale.
5. **Performance refactor?** — Profile hot paths; strengthen cache decorator; add DB indexes when moving off JSON snapshot.
