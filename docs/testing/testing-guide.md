# Testing guide

Canonical technical detail: [`docs/capstone/PHASE6_TESTING.md`](../capstone/PHASE6_TESTING.md).

---

## How to run tests

```bash
npm test
```

Runs **Vitest** in run mode (`vitest run` via npm script).

Optional local watch (not in `package.json` by default):

```bash
npx vitest
```

---

## Vitest vs Jest

| Aspect | In this repo |
|--------|--------------|
| Runner | **Vitest** (Jest-compatible API: `describe`, `it`, `expect`) |
| Rationale | Fast ESM-native runner aligned with **Vite** toolchain |

---

## What is tested

| Suite | File | Focus |
|-------|------|--------|
| Unit (Strategy) | `backend/tests/gradingStrategy.test.js` | `NumericGradingStrategy`, `RubricGradingStrategy` — **no Express** |
| HTTP smoke | `backend/tests/api.smoke.test.js` | `createLmsApp()`, health, catalog, admin login + stats |

---

## Mock / isolation strategy

- **Grading tests** import pure classes — **no network**, no DB.
- **Smoke tests** use **`resetLmsBackendForTests()`** between runs for a clean in-memory store.
- **Mocking:** Patterns illustrated via **test doubles** only where needed; axios is **not** the focus of backend tests (handlers use in-memory store).

---

## Testability design (submission talking points)

1. **Strategy** grading is **pure** logic → trivial unit tests.
2. **`createLmsApp()` factory** enables injecting the same stack as production without listening on a port in some tests (HTTP uses ephemeral server in smoke file).
3. **Separation of concerns:** routers thin; domain/patterns testable without UI.

---

## Coverage screenshot (placeholder)

If you enable coverage:

```bash
npx vitest run --coverage
```

Then capture **`coverage/index.html`** or terminal summary for your PDF. Track checklist: [`../screenshots/testing-proof.md`](../screenshots/testing-proof.md).

---

## Related npm scripts

| Script | Use |
|--------|-----|
| `npm test` | CI / local verification |
| `npm run lint` | Static analysis |
