# UML — Sequence diagram (submission)

**Scenario:** Instructor submits a grade; API selects a **Strategy** (numeric vs rubric), persists via **InMemoryStore** (serialized writes), and may emit **domain events** for notifications.

```mermaid
sequenceDiagram
  autonumber
  participant UI as React (Instructor)
  participant HTTP as Express Router
  participant Auth as authMiddleware
  participant Grading as GradingContext
  participant Strat as GradingStrategy
  participant Store as InMemoryStore

  UI->>HTTP: POST /api/v1/instructor/.../grade
  HTTP->>Auth: Bearer JWT
  Auth-->>HTTP: req.user (instructor)
  HTTP->>Grading: execute(assignmentId, payload)
  Grading->>Strat: grade(payload)
  Strat-->>Grading: score / feedback
  Grading->>Store: withWrite(update submission + scores)
  Store-->>Grading: OK
  Grading-->>HTTP: 200 JSON
  HTTP-->>UI: success
```

## Variant: observer fan-out

After `withWrite`, the production code may notify listeners registered via **Observer**-style domain events (see `DomainEvents.js`). For brevity, that optional async fan-out is omitted here; describe it in narration during demo.

## Export

Use [`docs/screenshots/uml-proof.md`](../screenshots/uml-proof.md) for submission captures.
