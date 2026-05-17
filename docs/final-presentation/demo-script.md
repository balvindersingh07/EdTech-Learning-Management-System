# Final presentation — demo script (~12 minutes)

Use this as a **read-aloud outline** for Loom / OBS. Adjust timings to your assessor’s limit.

| Time | Segment | What to show |
|------|---------|--------------|
| 0:00–1:00 | Intro | Repo on GitHub → `README.md` — problem (modular LMS), tech (React + Express), design focus (OOP + patterns). |
| 1:00–2:30 | GitHub walk | `docs/` tree: `architecture-overview.md`, `uml/`, `patterns/`, `testing/`. |
| 2:30–4:00 | UML | Open `docs/uml/class-diagram.md` (Mermaid) → export or scroll rendered diagram. |
| 4:00–6:30 | Live app | `npm run dev` — login as **admin** → approve pending user (if you demo flow) **or** login **student** → catalog → **instructor** → course builder snippet. |
| 6:30–8:30 | Patterns | Side-by-side: `docs/patterns/design-patterns.md` table + **one** code file (e.g. `GradingStrategy.js` or `CachedCourseRepository.js`). |
| 8:30–10:00 | Architecture | `docs/architecture-overview.md` — layered diagram; mention **cache decorator** + `withWrite` lock in one sentence each. |
| 10:00–11:00 | Refactor | `docs/refactoring.md` or `PHASE5` — **one** before/after story (role-split routes). |
| 11:00–12:00 | Testing | Terminal `npm test` green; mention Strategy unit tests without Express. |

**Closing:** Microservices = **future** decomposition; snapshot DB = **capstone trade-off**.

---

## Backup if live demo fails

- Show **pre-recorded** short clip **or**
- Walk **static screenshots** from `docs/screenshots/` checklists.
