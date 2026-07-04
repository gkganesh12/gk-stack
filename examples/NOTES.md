# Proof-run notes — predicted vs. actual

Before the run, five acceptance criteria were flagged as likely to fail or bend as
written. This ledger records how each prediction fared, plus what failed that was NOT
predicted. Full detail: [hono/DEVIATIONS.md](hono/DEVIATIONS.md) · [hono/FORK-RUN.md](hono/FORK-RUN.md).

| # | Prediction | What actually happened | Verdict |
|---|---|---|---|
| 1 | R3 "PR opens via gh" can't be checked without remote write access | Correct. Demonstrated to the remote boundary first; completed after fork sign-off — [PR #1](https://github.com/gkganesh12/hono/pull/1) against the fork's main. PRD amendment proposed (criterion assumes a writable origin). | **Predicted, confirmed, then resolved** |
| 2 | R4 "draft PRs from worktrees" — same remote problem | Correct, same resolution: [draft PR #2](https://github.com/gkganesh12/hono/pull/2) from worktree branch after sign-off. | **Predicted, confirmed, then resolved** |
| 3 | R4 two-strike rule not demonstrable on demand | Correct — it's a policy property. Rule verified as encoded in the command text; criterion rewording proposed (D2). | **Predicted, confirmed — PRD fix proposed** |
| 4 | R2 `"model": "opusplan"` might not be a valid settings.json value | **Wrong.** Current official docs list `opusplan` as a model alias and the `model` setting accepts aliases. Criterion stands as written. | **Prediction refuted — good news** |
| 5 | R2 hook `--if-present` default silently no-ops without a format script | Not hit on hono (real formatter wired: `bun run format:fix`; hook proven by prettier reformatting lines the model didn't touch). The starter-default blind spot is real; fix proposed (D3). | **Predicted, sidestepped here, starter fix proposed** |

## Not predicted, discovered in the run

- **R3 "unrelated staged changes" box was simply untested** in the first pass — an
  evidence gap, not a criterion defect. Closed on the fork: /ship stopped with a
  question, no commit (D5).
- **`gh pr create` on a fork clone defaults to the parent repo.** The single most
  dangerous foot-gun of the whole exercise given the zero-upstream-contact rule.
  Mitigations that worked: clone FROM the fork so it's the only remote, `gh repo
  set-default <fork>`, explicit `--repo` on every PR command, and post-run verification
  that upstream shows zero activity. Now a Learned Rule in the example CLAUDE.md.
- **Permission wildcards blocked upstream `gh` reads in the triage session** — which
  accidentally produced a better demo: /triage degraded gracefully per spec, listed the
  unreachable sources, and pivoted to locally-gatherable noise (lint warnings).
- **A shallow clone (`--depth 1`) was sufficient for every Phase 1 requirement.**
  The initial full clone stalled on a slow network; nothing in R1–R6 needed history.

## Scorecard

18 acceptance boxes → **17 checked as written** after the fork run; 1 remaining is the
two-strike policy box whose rewording is proposed in D2. Zero criteria silently adapted.
