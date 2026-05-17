# Contributing

This repository is primarily an **academic capstone** submission. External contributions are welcome for typo fixes, documentation clarifications, and non-breaking test additions.

## Ground rules

1. **Do not break** existing API contracts, tests, or the documented design-phase structure under `docs/capstone/`.
2. **Prefer** small, focused pull requests with a clear description.
3. **Run** `npm test` and `npm run build` before opening a PR.
4. **Never commit** `.env`, database files, or secrets.

## Local setup

See the root [README.md](README.md) — `npm install`, configure `.env` from `.env.example`, `npm run db:migrate`, then `npm run dev`.

## Documentation

Submission-oriented docs live under `docs/` (`uml/`, `patterns/`, `testing/`, `final-presentation/`, `screenshots/`). When adding features, update the relevant phase doc in `docs/capstone/` or the matching `docs/**/*.md` file.

## Questions

For course submission, follow your institution’s channel. For repo maintenance, use GitHub Issues on the project repository.
