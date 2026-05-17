# Repository tree summary (high level)

Auto-maintained overview for submission; regenerate with:

```powershell
# From repo root (Windows PowerShell)
Get-ChildItem -Depth 3 -Directory | ForEach-Object { $_.FullName.Replace((Get-Location).Path + '\', '') }
```

## Top-level layout (2026)

```text
EdTech-Learning-Management-System/
├── backend/
│   ├── src/
│   │   ├── application/      # Ports (e.g. CourseRepositoryPort)
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── interfaces/http/  # Express routers, middleware
│   │   └── patterns/         # Creational / structural / behavioral demos
│   └── tests/                # Vitest
├── docs/
│   ├── architecture-overview.md
│   ├── refactoring.md
│   ├── solid-principles.md
│   ├── README.md              # Submission doc index
│   ├── capstone/              # PHASE1–6 + SUBMISSION_EVALUATION_GUIDE
│   ├── final-presentation/
│   ├── patterns/
│   ├── screenshots/
│   ├── testing/
│   └── uml/
├── prisma/
├── scripts/                   # Prisma postinstall helper
├── src/                       # React SPA
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── README.md
└── vercel.json
```

No duplicate submission roots: **`docs/capstone/`** = phased deliverables; **`docs/*.md` and subfolders** = consolidated evaluator guides.
