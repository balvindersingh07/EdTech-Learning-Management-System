# EdTech LMS (Capstone)

Modular **Learning Management System**: students (catalog, enroll, submit), instructors (courses, grading), admins (users, reports). Backend emphasizes **SOLID**, **design patterns**, and **layered / hex-style** structure. See **`docs/capstone/`** for phase deliverables (domain, SOLID module, patterns, architecture, refactoring, testing).

## Logical module map (submission rubric)

| Rubric folder idea | In this repository |
|--------------------|---------------------|
| `users/` | `backend/src/interfaces/http/authController.js`, `adminRoutes.js` (approve/reject), `domain/entities/*Profile.js`, `UserFactory.js` |
| `courses/` | `CourseBuilder.js`, `CourseRepository.js`, `studentRoutes` / `instructorRoutes` course endpoints |
| `grading/` | `patterns/strategy/GradingStrategy.js`, instructor grade route |
| `notifications/` | `patterns/observer/DomainEvents.js`, `LegacyEmailAdapter.js`, `GET /api/v1/notifications` |
| `tests/` | `backend/tests/*.test.js` (Vitest) |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite SPA + in-process Express API (`/api`) |
| `npm run dev:api` | Standalone API only (`PORT` default 4000) |
| `npm run dev:web` | Frontend only |
| `npm run build` | Typecheck + production bundle |
| `npm test` | Vitest (grading unit tests + HTTP smoke) |
| `npm run db:generate` | Prisma client |
| `npm run db:migrate` | Apply SQLite migrations |

## Persistence

- **Vite dev:** in-memory seed (fast HMR).
- **Standalone API (`npm run dev:api`):** Prisma SQLite **`AppStateSnapshot`** saves full LMS JSON after each transactional `withWrite` — see `docs/capstone/PHASE6_TESTING.md`.

## Auth (demo)

Bootstrap admin: `admin@lms.local` / `Admin@123` (override with `ADMIN_EMAIL` / `ADMIN_PASSWORD` on the API process). Students and instructors self-register and require **admin approval** before login.

## Submission extras

- **Evaluation + video script + pattern table:** `docs/capstone/SUBMISSION_EVALUATION_GUIDE.md`
