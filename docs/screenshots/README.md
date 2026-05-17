# Screenshots folder

**Purpose:** Store **manually captured** images for your **PDF report**, **slides**, or **Learning Management System** submission portal.

**Do not commit secrets.** Avoid screenshots that show `.env`, JWT tokens, or production passwords.

### Image not showing on GitHub?

- Path must match the committed file exactly (GitHub is **case-sensitive**): e.g. `docs/screenshots/ci-github-actions-azure.png`.
- Prefer `![alt](docs/screenshots/file.png)` in README (repo root). Do **not** use Windows paths (`E:\...`) or missing folders (e.g. `assets/screenshot.png` if you never added that file).
- The PNG must be on the **default branch** you are viewing (usually `main`).
- If a workflow **generates** the image, the job must **commit and push** that file (with `contents: write` / token permissions); otherwise the README link stays broken.

## Gallery files (linked from root `README.md`)

| File | Content |
|------|---------|
| `ci-github-actions-azure.png` | Actions tab — green run: **Build and deploy Node.js app to Azure Web App** (build + deploy jobs). |
| `github-branch-protection-main.png` | Settings → Branches — protection rule on `main`. |
| `github-pr-grading-merged.png` | Merged PR (e.g. grading / Strategy pattern). |
| `ui-admin-dashboard.png` | Admin control center / user directory. |
| `ui-student-dashboard.png` | Student learning hub. |
| `ui-instructor-dashboard.png` | Instructor teaching overview. |

## Optional extra files

| File | Suggested content |
|------|-------------------|
| `01-github-repo-overview.png` | Main repo page — stars, description, last commit. |
| `02-folder-structure.png` | IDE or GitHub tree showing `backend/`, `src/`, `docs/`. |
| `03-tests-passing.png` | Terminal or CI showing `npm test` green. |
| `04-architecture-diagram-export.png` | Export from Mermaid (e.g. mermaid.live) or draw.io if you redraw. |

## Checklists

Use these markdown lists to track what you still owe the submission:

- [`github-proof.md`](github-proof.md)
- [`uml-proof.md`](uml-proof.md)
- [`testing-proof.md`](testing-proof.md)
- [`architecture-proof.md`](architecture-proof.md)
