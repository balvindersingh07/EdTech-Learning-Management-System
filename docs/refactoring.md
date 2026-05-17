# Refactoring & anti-patterns

This file consolidates **before/after** narrative for submission. Full phase write-up: [`docs/capstone/PHASE5_REFACTORING.md`](capstone/PHASE5_REFACTORING.md).

---

## 1. God route / mixed roles (UI)

**Smell:** One navigation area mixed **student browse**, **instructor tools**, and **admin** affordances — easy to violate RBAC by accident.

**Before (conceptual):**

```tsx
// Single /app/courses tree mixing personas — risky for capstone demo
<Route path="/app/courses/*" element={<MixedCourseShell />} />
```

**After (conceptual):**

```tsx
// Persona-scoped subtrees with RoleGuard
<Route path="/app/student/*" element={<StudentLayout />} />
<Route path="/app/instructor/*" element={<InstructorLayout />} />
<Route path="/app/admin/*" element={<AdminLayout />} />
```

**Why better:** **Readability** — routes mirror **bounded contexts**; **testability** — role guards are predictable; **maintainability** — fewer accidental feature leaks.

---

## 2. Fat client “mock vs real” services

**Smell:** Services silently toggled **mock** vs **Axios** via env — integration bugs hidden.

**Before (conceptual):**

```ts
// One service object; mode flag decides fetch vs mock — hard to test honestly
async function getCourses() {
  if (import.meta.env.VITE_USE_MOCK) return MOCK_COURSES;
  return axios.get("/api/...");
}
```

**After (conceptual):**

```ts
// Dedicated modules per persona — always hit real API in dev via Vite proxy
import { studentCourseService } from "@/services/student/studentCourseService";
// Implements real HTTP; failures surface in UI and smoke tests
```

**Why better:** **Testability** — smoke tests lock API contract; **debuggability** — fewer hidden branches.

---

## 3. Duplicate grading surface (admin accessing instructor grading)

**Smell:** Admin could navigate to **instructor-only** grading — instructional integrity risk.

**Before:** Grading URL registered outside instructor-only subtree.

**After:** Grading only under `/app/instructor/.../grade`; backend enforces `InstructorProfile#ownsCourse`.

**Why better:** **Security clarity**; **SRP** — admin reports stay on admin routes; grading policy centralized on server.

---

## Metrics (qualitative)

| Dimension | Improvement |
|-----------|-------------|
| Readability | Persona folders match mental model |
| Reusability | Pattern-based grading and exports reused |
| Testability | Vitest smoke + strategy unit tests |

---

## Files to mention in presentation

- `src/routes/AppRoutes.tsx` (or equivalent route table)
- `src/services/student/*`, `instructor/*`, `admin/*`
- `backend/src/interfaces/http/instructorRoutes.js` (ownership checks)
