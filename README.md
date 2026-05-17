# Alma EdTech LMS

A **modular Learning Management System** capstone: role-separated experiences for **students**, **instructors**, and **administrators**, with a **layered Express API**, **React (Vite)** client, and explicit **SOLID** + **design-pattern** structure for maintainability and assessment.

[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)

---

## Table of contents

- [Overview](#overview)
- [Capstone rubric alignment (college requirements)](#capstone-rubric-alignment-college-requirements)
- [Academic submission documentation](#academic-submission-documentation)
- [Features](#features)
- [Architecture](#architecture)
- [UML & design documentation](#uml--design-documentation)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API surface](#api-surface)
- [Repository layout](#repository-layout)
- [Design documentation (phases)](#design-documentation-phases)
- [Testing](#testing)
- [Screenshots (submission)](#screenshots-submission)
- [Persistence model](#persistence-model)
- [Deploy frontend (Vercel)](#deploy-frontend-vercel)
- [Deploy backend (Azure App Service)](#deploy-backend-azure-app-service)
- [Security notes (demo)](#security-notes-demo)
- [Future improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgement](#acknowledgement)

---

## Overview

This project models a real-world **EdTech platform**: catalog and enrollment for learners, course authoring and grading for faculty, and user governance plus reports for operators. The codebase is organized to demonstrate **encapsulation**, **abstraction**, **polymorphism** (role profiles), **SOLID**, and **six or more GoF-style patterns** with traceable file locations and phase documentation under `docs/capstone/`.

---

## Capstone rubric alignment (college requirements)

Quick map from the **official capstone brief** to this repository — for evaluators and viva.

### LMS modules (required)

| Module | What you get here | Primary locations |
|--------|-------------------|-------------------|
| **User management** | JWT login/signup, admin approval, user directory, roles | `backend/src/interfaces/http/authController.js`, `adminRoutes.js`, `patterns/factory/UserFactory.js`, Admin UI |
| **Course management** | Catalog, enrollment, instructor CRUD, **Builder** | `patterns/builder/CourseBuilder.js`, student/instructor routes, course pages |
| **Assignment submission** | Student submit flow, lifecycle guards (**State**) | `patterns/state/AssignmentSubmissionState.js`, student assignment routes |
| **Assessment grading** | **Strategy** pattern — numeric vs rubric | `patterns/strategy/GradingStrategy.js`, instructor grading UI |
| **Notifications & reports** | Observer-style events, admin/instructor reports, **Bridge** exports | `patterns/observer/DomainEvents.js`, `patterns/bridge/ReportExporter.js`, report pages |

### Design & quality requirements

| Requirement | Evidence in repo |
|-------------|------------------|
| **OOP** (encapsulation, inheritance, abstraction, polymorphism) | [`docs/solid-principles.md`](docs/solid-principles.md), [`docs/capstone/PHASE1_DOMAIN.md`](docs/capstone/PHASE1_DOMAIN.md) |
| **SOLID** | [`docs/capstone/PHASE2_SOLID_COURSE_MODULE.md`](docs/capstone/PHASE2_SOLID_COURSE_MODULE.md), ports (`CourseRepositoryPort`), builders |
| **UML** | Mermaid in Phase 1 + [`docs/uml/class-diagram.md`](docs/uml/class-diagram.md), [`docs/uml/sequence-diagram.md`](docs/uml/sequence-diagram.md) — export PNG/PDF via [mermaid.live](https://mermaid.live) |
| **≥ 6 patterns** (Singleton, Factory, Builder, Adapter, Bridge, Decorator, Observer, Strategy, State) | **10+** documented: [`docs/patterns/design-patterns.md`](docs/patterns/design-patterns.md), `backend/src/patterns/**` |
| **Layered / MVC / hexagonal** + caching + concurrency | [`docs/architecture-overview.md`](docs/architecture-overview.md), [`docs/capstone/PHASE4_ARCHITECTURE.md`](docs/capstone/PHASE4_ARCHITECTURE.md) |
| **Microservices** | Described as **future decomposition**; current app is a **modular monolith** with clear boundaries |
| **Anti-patterns → refactor (2–3)** | [`docs/refactoring.md`](docs/refactoring.md), [`docs/capstone/PHASE5_REFACTORING.md`](docs/capstone/PHASE5_REFACTORING.md) |
| **Testability**, **Strategy** tests, **Decorator** RBAC | `npm test` (Vitest), [`docs/capstone/PHASE6_TESTING.md`](docs/capstone/PHASE6_TESTING.md), `RoleGuardedHandlerDecorator.js` |

### Project phases (deliverables)

| Phase | Deliverable | Document |
|-------|-------------|----------|
| 1 | User stories, functional requirements, UML, OOP mapping | [`PHASE1_DOMAIN.md`](docs/capstone/PHASE1_DOMAIN.md) |
| 2 | SOLID on one full module (course) | [`PHASE2_SOLID_COURSE_MODULE.md`](docs/capstone/PHASE2_SOLID_COURSE_MODULE.md) |
| 3 | 6+ patterns, code + comments | [`PHASE3_PATTERNS.md`](docs/capstone/PHASE3_PATTERNS.md) |
| 4 | Architecture blueprint, cache, concurrency | [`PHASE4_ARCHITECTURE.md`](docs/capstone/PHASE4_ARCHITECTURE.md) |
| 5 | Refactoring & smells | [`PHASE5_REFACTORING.md`](docs/capstone/PHASE5_REFACTORING.md) |
| 6 | Testing, observability, packaging | [`PHASE6_TESTING.md`](docs/capstone/PHASE6_TESTING.md) |

### Tools (rubric ↔ this project)

| Area | Rubric | This repo |
|------|--------|-----------|
| Language | Java / JavaScript / Python | **JavaScript + TypeScript** (Node, Express, React) |
| IDE | IntelliJ / VSCode | **VS Code / Cursor** (any) |
| UML | Lucidchart / Draw.io | **Mermaid** in `docs/` (export for report) |
| Version control | Git / GitHub | **GitHub** — `main` / `develop`, PR workflow, branch protection on `main` |
| Testing | JUnit / Jest / PyTest | **Vitest** — `npm test` |
| Presentation | Loom / OBS / Slides | Outlines: [`docs/final-presentation/`](docs/final-presentation/) |
| **CI/CD** (engineering practice) | — | **GitHub Actions** → Azure Web App ([`.github/workflows/`](.github/workflows/)); **Vercel** for frontend SPA |

### Screenshots for report / video

After **`npm run dev`**, capture: **Admin** (control center, user directory, activity), **Student** (learning hub, catalog), **Instructor** (teaching overview, grading queue). **GitHub-visible gallery** (commit PNGs first): [Screenshots (submission)](#screenshots-submission). Checklists: [`docs/screenshots/`](docs/screenshots/).

### Grading note

**Local demo** (`npm run dev`, `VITE_API_URL=/api` in `.env`) is sufficient for assessment if cloud billing is unavailable. Design, docs, and automated tests are independent of paid hosting.

---

## Academic submission documentation

**Evaluator-facing index:** [`docs/README.md`](docs/README.md)

| Topic | Document |
|-------|----------|
| Architecture (layers, MVC map, hex, scale/cache/concurrency) | [`docs/architecture-overview.md`](docs/architecture-overview.md) |
| UML class & sequence (Mermaid) | [`docs/uml/class-diagram.md`](docs/uml/class-diagram.md), [`docs/uml/sequence-diagram.md`](docs/uml/sequence-diagram.md) |
| Design patterns (table + rationale) | [`docs/patterns/design-patterns.md`](docs/patterns/design-patterns.md) |
| SOLID & OOP mapping | [`docs/solid-principles.md`](docs/solid-principles.md) |
| Refactoring / anti-patterns | [`docs/refactoring.md`](docs/refactoring.md) |
| Testing guide | [`docs/testing/testing-guide.md`](docs/testing/testing-guide.md) |
| Demo & video outline | [`docs/final-presentation/demo-script.md`](docs/final-presentation/demo-script.md), [`docs/final-presentation/video-flow.md`](docs/final-presentation/video-flow.md) |
| Screenshot checklists | [`docs/screenshots/`](docs/screenshots/) |

---

## Features

| Area | Highlights |
|------|------------|
| **Authentication** | JWT login; student/instructor **self-registration** with **admin approval**; bootstrap admin account (env-overridable). |
| **Students** | Course catalog, enrollment, assignment list, submission flow with guarded lifecycle (**State** pattern on the API). |
| **Instructors** | Course CRUD with **Builder**; subjects (built-in `lms-subj-*` + custom); assignments queue; **Strategy**-based grading (numeric / rubric); teaching summary for reports. |
| **Admins** | User directory, approve/reject, activity log, exportable summary (**Bridge** pattern), platform stats. |
| **Cross-cutting** | Role middleware, **Decorator**-based RBAC demo, **Observer**-style domain events for notifications, request logging. |

---

## Architecture

High level: **React SPA** talks to **REST JSON API** under `/api/v1`. Development can run the API **inside Vite** (same origin) or as a **standalone Node** process with **Prisma-backed** snapshot persistence.

**Extended (submission):** layered vs MVC vs hexagonal notes, caching, and concurrency — see **[`docs/architecture-overview.md`](docs/architecture-overview.md)** (figures in Mermaid).

```mermaid
flowchart LR
  subgraph client [React Client]
    UI[Pages and Redux]
    SVC[Role-scoped services]
  end
  subgraph api [Express API]
    R[HTTP Routers]
    M[Auth / RBAC Middleware]
    P[Patterns and Domain]
    ST[InMemoryStore + optional Prisma snapshot]
  end
  UI --> SVC
  SVC -->|Axios /api| R
  R --> M
  M --> P
  P --> ST
```

---

## UML & design documentation

| Asset | Link |
|-------|------|
| Class diagram (extended) | [`docs/uml/class-diagram.md`](docs/uml/class-diagram.md) |
| Sequence diagram (grading) | [`docs/uml/sequence-diagram.md`](docs/uml/sequence-diagram.md) |
| Requirements + domain UML | [`docs/capstone/PHASE1_DOMAIN.md`](docs/capstone/PHASE1_DOMAIN.md) |
| Pattern catalog (assessor table) | [`docs/patterns/design-patterns.md`](docs/patterns/design-patterns.md) |

Export diagrams for PDF/slides using [mermaid.live](https://mermaid.live) or any Mermaid-capable preview.

---

## Tech stack

| Layer | Choices |
|-------|---------|
| **UI** | React 19, React Router 7, Redux Toolkit, Tailwind CSS, Vite 6 |
| **API** | Express 4, `jsonwebtoken`, CORS |
| **Data** | Prisma 5 + SQLite (path from **`DATABASE_URL`**, default `file:./prisma/dev.db`); runtime graph serialized to **`AppStateSnapshot`** when using standalone `server.js` |
| **Quality** | TypeScript, ESLint, Vitest |

---

## Getting started

### Prerequisites

- **Node.js** ≥ 18  
- **npm** (ships with Node)

### Install

```bash
git clone https://github.com/balvindersingh07/EdTech-Learning-Management-System.git
cd EdTech-Learning-Management-System
npm install
```

### Database (first run)

Ensure **`.env`** includes `DATABASE_URL` (see `.env.example`), then:

```bash
npm run db:generate
npm run db:migrate
```

### Run the app (recommended for local demo)

```bash
npm run dev
```

Opens the Vite dev server (default **http://localhost:5173**). The API is mounted at **`/api`** by the Vite dev plugin so the SPA and backend share one origin.

### Run API and web on separate ports

```bash
npm run dev:stack
```

Uses **concurrently** to run Vite and `node backend/src/server.js` together. Point `VITE_API_URL` at the API origin if you split hosts (see `.env.example`).

---

## Environment variables

Copy `.env.example` to `.env` and adjust. Common entries:

| Variable | Used by | Purpose |
|----------|---------|---------|
| `ADMIN_EMAIL` | Node API | Override bootstrap admin email |
| `ADMIN_PASSWORD` | Node API | Override bootstrap admin password |
| `JWT_SECRET` | Node API | JWT signing secret (change for any shared environment) |
| `DATABASE_URL` | Prisma / API | SQLite connection string, e.g. `file:./prisma/dev.db` (required for `db:migrate` and Azure) |
| `VITE_API_URL` | Vite | API base URL (default `/api` for embedded API) |
| `PORT` | Standalone API | Listen port (default `4000`; Azure sets `PORT` automatically) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite + embedded Express API at `/api` |
| `npm run dev:web` | Frontend only |
| `npm run dev:api` | Standalone Express API with Prisma snapshot persistence |
| `npm run dev:stack` | Vite + standalone API via `concurrently` |
| `npm run build` | `tsc --noEmit` then production Vite build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Vitest — unit + HTTP smoke tests |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Apply migrations (dev) |
| `npm run db:push` | Push schema (prototyping; prefer migrate for teams) |
| `npm run db:studio` | Prisma Studio GUI |
| `npm start` | **`node backend/src/server.js`** — runs best-effort `prisma migrate deploy` inside the process (failures are logged; API still starts). Azure / PaaS default. |
| `npm run start:with-migrate` | Strict **`prisma migrate deploy`** then server (CI or when you want a hard fail on migrate) |

---

## API surface

Base path: **`/api/v1`**

| Prefix | Audience | Examples |
|--------|----------|----------|
| `/auth` | Public | `POST /login`, `POST /signup` |
| `/catalog` | Public | `GET /subjects` |
| `/notifications` | Authenticated | `GET /notifications` |
| `/student` | Student JWT | Catalog, enroll, assignments, submit |
| `/instructor` | Instructor JWT | Courses, subjects, assignments, grading, reports summary |
| `/admin` | Admin JWT | Users, approve/reject, activity, stats, HTML/JSON reports |

Full behavior is documented in `docs/capstone/PHASE1_DOMAIN.md` (requirements) and implemented under `backend/src/interfaces/http/`.

---

## Repository layout

```
├── backend/src/           # Express app, routes, middleware, domain, infrastructure
│   ├── application/       # Ports (e.g. CourseRepositoryPort)
│   ├── domain/            # Entities / profiles
│   ├── infrastructure/    # Store, seed, Prisma-related bootstrap
│   ├── interfaces/http/ # Routers + middleware
│   └── patterns/          # Singleton, Factory, Builder, Adapter, Bridge, Decorators, Observer, Strategy, State
├── backend/tests/         # Vitest tests
├── docs/                  # Submission index: README.md; uml, patterns, testing, screenshots, etc.
│   ├── capstone/          # Phase 1–6 + evaluation guide
│   ├── final-presentation/
│   ├── patterns/
│   ├── screenshots/
│   ├── testing/
│   └── uml/
├── prisma/                # Schema, migrations, SQLite file (gitignored if local only — see .gitignore)
├── src/                   # React app (pages, components, store, services)
└── package.json
```

**Rubric “users/, courses/, …” folders:** the repo uses **layered folders** instead of literal top-level `users/` directories. Mapping from capstone rubric to paths is in **`docs/capstone/SUBMISSION_EVALUATION_GUIDE.md`** and summarized in the table below.

| Conceptual module | Primary locations |
|-------------------|-------------------|
| Users & auth | `interfaces/http/authController.js`, `middleware/`, `domain/entities/*Profile.js`, `patterns/factory/UserFactory.js` |
| Courses | `patterns/builder/CourseBuilder.js`, `infrastructure/CourseRepository.js`, student/instructor routes |
| Grading | `patterns/strategy/GradingStrategy.js`, instructor grade endpoints |
| Notifications | `patterns/observer/DomainEvents.js`, `patterns/adapter/LegacyEmailAdapter.js` |
| Tests | `backend/tests/` |

---

## Design documentation (phases)

| Document | Content |
|----------|---------|
| [`docs/capstone/PHASE1_DOMAIN.md`](docs/capstone/PHASE1_DOMAIN.md) | User stories, functional requirements, UML (Mermaid) |
| [`docs/capstone/PHASE2_SOLID_COURSE_MODULE.md`](docs/capstone/PHASE2_SOLID_COURSE_MODULE.md) | SOLID on course module |
| [`docs/capstone/PHASE3_PATTERNS.md`](docs/capstone/PHASE3_PATTERNS.md) | Pattern catalog and file map |
| [`docs/capstone/PHASE4_ARCHITECTURE.md`](docs/capstone/PHASE4_ARCHITECTURE.md) | Layered architecture, caching, concurrency |
| [`docs/capstone/PHASE5_REFACTORING.md`](docs/capstone/PHASE5_REFACTORING.md) | Anti-patterns and refactors |
| [`docs/capstone/PHASE6_TESTING.md`](docs/capstone/PHASE6_TESTING.md) | Tests, observability, packaging, persistence |
| [`docs/capstone/SUBMISSION_EVALUATION_GUIDE.md`](docs/capstone/SUBMISSION_EVALUATION_GUIDE.md) | Rubric alignment, video outline, pattern table |

**Also see:** consolidated guides under [`docs/`](docs/README.md) (`architecture-overview.md`, `solid-principles.md`, `refactoring.md`, etc.).

---

## Testing

```bash
npm test
```

- **Unit:** grading strategies (`backend/tests/gradingStrategy.test.js`) — no Express boot.
- **Smoke:** HTTP checks against `createLmsApp()` (`backend/tests/api.smoke.test.js`) — health, catalog, admin login, stats.

**Full guide:** [`docs/testing/testing-guide.md`](docs/testing/testing-guide.md) (Vitest, mocks, coverage placeholder).

---

## Screenshots (submission)

### Gallery (renders on GitHub)

Add PNGs under [`docs/screenshots/`](docs/screenshots/) using the names below — they will show on the repo home once committed.

| Screenshot | File name |
|------------|-----------|
| **GitHub Actions** — successful workflow (`build` + `deploy` to Azure) | [`docs/screenshots/ci-github-actions-azure.png`](docs/screenshots/ci-github-actions-azure.png) |
| **Branch protection** — rule on `main` | [`docs/screenshots/github-branch-protection-main.png`](docs/screenshots/github-branch-protection-main.png) |
| **Pull request** — merged feature (e.g. grading / Strategy) | [`docs/screenshots/github-pr-grading-merged.png`](docs/screenshots/github-pr-grading-merged.png) |
| **Admin** — control center / user directory | [`docs/screenshots/ui-admin-dashboard.png`](docs/screenshots/ui-admin-dashboard.png) |
| **Student** — learning hub | [`docs/screenshots/ui-student-dashboard.png`](docs/screenshots/ui-student-dashboard.png) |
| **Instructor** — teaching overview | [`docs/screenshots/ui-instructor-dashboard.png`](docs/screenshots/ui-instructor-dashboard.png) |

<p align="center">
  <b>CI/CD — GitHub Actions → Azure</b><br/>
  <img src="docs/screenshots/ci-github-actions-azure.png" alt="GitHub Actions workflow success" width="720"/>
</p>

<p align="center">
  <b>Repository governance</b><br/>
  <img src="docs/screenshots/github-branch-protection-main.png" alt="Branch protection on main" width="720"/>
  ·
  <img src="docs/screenshots/github-pr-grading-merged.png" alt="Merged pull request" width="720"/>
</p>

<p align="center">
  <b>Alma LMS — role dashboards</b><br/>
  <img src="docs/screenshots/ui-admin-dashboard.png" alt="Admin dashboard" width="320"/>
  <img src="docs/screenshots/ui-student-dashboard.png" alt="Student dashboard" width="320"/>
  <img src="docs/screenshots/ui-instructor-dashboard.png" alt="Instructor dashboard" width="320"/>
</p>

**Setup:** Export screenshots from your machine → save with the exact paths above → `git add docs/screenshots/*.png` → commit → push. Do not commit images that show secrets (tokens, `.env` values).

### Checklists (extra proof for report / viva)

- [`docs/screenshots/github-proof.md`](docs/screenshots/github-proof.md) — repo, commits, tree  
- [`docs/screenshots/uml-proof.md`](docs/screenshots/uml-proof.md) — exported diagrams  
- [`docs/screenshots/testing-proof.md`](docs/screenshots/testing-proof.md) — `npm test` / coverage  
- [`docs/screenshots/architecture-proof.md`](docs/screenshots/architecture-proof.md) — architecture figures  

Naming reference: [`docs/screenshots/README.md`](docs/screenshots/README.md).

---

## Persistence model

| Mode | Behavior |
|------|----------|
| **`npm run dev`** (Vite) | In-memory seed for fast iteration; state resets when the dev server restarts. |
| **`npm run dev:api`** (`server.js`) | After each successful `store.withWrite`, the **entire LMS graph** is serialized to SQLite table **`AppStateSnapshot`** (single row). Survives API process restarts. Requires **`DATABASE_URL`** (e.g. `file:./prisma/dev.db`). |

Details: [`docs/capstone/PHASE6_TESTING.md`](docs/capstone/PHASE6_TESTING.md).

---

## Deploy frontend (Vercel)

1. In [Vercel](https://vercel.com) → **Add New Project** → import this GitHub repo.
2. **Root Directory** `./`, **Framework Preset** Vite (auto). Build: `npm run build`, output: `dist` (defaults).
3. **Environment variables** (optional but recommended): set **`VITE_API_URL`** to your **hosted Express API** base ending in `/api` (e.g. `https://your-app.azurewebsites.net/api`). If you omit it, the production build uses the default in [`src/config/apiBase.ts`](src/config/apiBase.ts) — **update that constant** when your Azure hostname changes.
4. **Deploy / redeploy** so the build picks up env and latest `main`.
5. `vercel.json` adds a SPA fallback so React Router deep links resolve after refresh.

---

## Deploy backend (Azure App Service)

Target: **Linux** Web App, **Node 20 LTS**, deploy **this same repo** (monorepo). The API listens on **`process.env.PORT`** and serves routes under **`/api/v1`**.

### 1. Create the Web App

1. [Azure Portal](https://portal.azure.com) → **Create a resource** → **Web App**.
2. **Publish**: Code · **Runtime stack**: Node 20 LTS · **Operating System**: Linux.
3. **App Service Plan**: any tier that allows outbound HTTPS (Free F1 is enough for demos; cold starts apply).

### 2. Application settings (Configuration → Application settings)

Add at least:

| Name | Example value | Notes |
|------|----------------|-------|
| `DATABASE_URL` | `file:./prisma/prod.db` | SQLite file under `/home/site/wwwroot/prisma/` — persists across restarts on Linux App Service. |
| `JWT_SECRET` | long random string | Do not use the dev default in shared environments. |
| `NODE_ENV` | `production` | Recommended. |

Optional: `ADMIN_EMAIL`, `ADMIN_PASSWORD` (see `.env.example`). **`PORT`** is assigned by the platform — do not override unless you know the requirement for your SKU.

### 3. Deployment

- **Deployment Center**: connect your GitHub repo and branch **`main`**, enable **build** on the server (Oryx). The repo `npm run build` runs the frontend TypeScript check and Vite build; that is acceptable for deploys.
- **Startup command** (Configuration → General settings): leave default **`npm start`** (`node backend/src/server.js`). Migrations run inside startup and **do not** block the process from listening if they fail (check **Log stream** for `[LMS] prisma migrate deploy failed`).

First cold start may take longer while Prisma runs.

### 4. CORS + Vercel

The API uses permissive CORS for demos (`origin: true`). Point your Vercel **`VITE_API_URL`** at `https://<your-webapp-name>.azurewebsites.net/api` and redeploy the frontend.

### 5. Health check

Use **`/health`** as a lightweight probe path if you configure App Service **Health check**.

---

## Future improvements

- **Normalized persistence** (PostgreSQL) per bounded context instead of JSON snapshot for reporting at very large scale  
- **Microservices** split (auth, catalog, grading) behind API gateway — described as evolution path in [`docs/architecture-overview.md`](docs/architecture-overview.md)  
- **E2E** tests (Playwright/Cypress) for critical learner/instructor flows  
- **Stricter CORS**, rotating secrets, and structured logging (Pino) + distributed tracing in production  

---

## Contributing

See **[`CONTRIBUTING.md`](CONTRIBUTING.md)** for capstone-safe contribution guidelines.

---

## Security notes (demo)

- Default JWT secret and admin password are for **local demonstration only**. **Rotate** `JWT_SECRET`, `ADMIN_PASSWORD`, and database paths before any shared or production deployment.
- CORS is permissive in development; tighten for production.
- Assignment of **admin** role via public signup is **disabled**; one bootstrap admin is seeded (overridable via env).

---

## License

Licensed under the **MIT License** — see [`LICENSE`](LICENSE).

This repository is submitted primarily for **academic evaluation**; ensure your institution’s originality and licensing requirements are met.

---

## Acknowledgement

Built as a **software design & architecture capstone** emphasizing OOP, SOLID, design patterns, and layered structure over feature breadth.
