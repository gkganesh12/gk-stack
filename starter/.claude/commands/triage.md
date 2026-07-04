---
description: Gather repo noise (CI failures, issues, PR comments), classify it, fix safe chores as draft PRs, and produce one severity-ordered digest
---

## Pre-computed context
- Branch: !`git branch --show-current`
- Failing CI runs: !`gh run list --status failure --limit 10 2>/dev/null || echo "(gh unavailable — CI runs not gathered)"`
- Open issues: !`gh issue list --state open --limit 20 2>/dev/null || echo "(gh unavailable — issues not gathered)"`
- Open PRs: !`gh pr list --state open --limit 10 2>/dev/null || echo "(gh unavailable — PRs not gathered)"`

## Your task

1. **Gather.** From the context above plus `gh` follow-ups (CI logs via `gh run view`,
   unanswered review comments via `gh pr view --comments`), collect everything that
   needs a human or agent decision. A source you cannot reach is not an error —
   state plainly what could not be gathered and continue with the rest.
2. **Classify** every item:
   - **P0** — broken for users right now
   - **P1** — a real bug, not currently user-breaking
   - **P2** — chore: lint, formatting, dependency bumps, stale docs, flaky-test quarantine
   - **noise** — duplicates, questions already answered, stale bots
3. **Act on P2 only.** For each P2 chore: create an isolated worktree
   (`git worktree add ../triage-<slug> -b triage/<slug>`), fix it there, verify per
   CLAUDE.md, and open a **draft** PR. Never commit to main, never merge, never push
   to an existing branch you don't own.
4. **Two strikes.** If a fix attempt fails twice, stop: mark the item FLAGGED with
   what was tried and the actual error. Do not try a third time.
5. **P0/P1: brief, don't fix.** Write a decision-ready brief per item: reproduction
   steps or failing-run link, suspected cause, the relevant trace or log excerpt.
   No fix attempts — these need a human routing decision first.
6. **Security findings are report-only, always** — scanner output, vulnerable
   dependencies, authz gaps. Whatever their classification, they go in the digest
   as reports; never auto-fix them.
7. **Digest.** Reply with a single digest, ordered P0 → P1 → P2 → noise. Each item:
   one line, a link (issue/PR/run), and its status (BRIEF / DRAFT-PR / FLAGGED /
   SKIPPED-noise). End with the list of sources you could not reach, if any.
