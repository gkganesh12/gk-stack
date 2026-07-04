# PRD acceptance criteria that failed or bent as written — proof-run findings

Per the PRD's own rule: surface conflicts, never silently adapt. Each item below
proposes a PRD amendment where the criterion itself needs fixing.

## D1 — R3 "a PR opens via gh" / R4 "draft PRs from worktrees" require remote write access

**What happened:** the proof ran under a no-pushes-without-sign-off rule, and the
target was an upstream repo we don't own. `/ship` demonstrated everything up to the
remote boundary (conventional commit on a branch, never main), then stopped and asked
the human — which is itself correct behavior. Opening real draft PRs against someone
else's OSS project as a demo would be spam regardless of permissions.
**Status:** RESOLVED 2026-07-04 — fork sign-off granted; both boxes completed against
gkganesh12/hono with zero upstream contact ([FORK-RUN.md](FORK-RUN.md)).
**Proposed amendment:** R3/R4 should say "PR opens via `gh` against the team's
designated remote" and note that bootstrap runs on third-party repos must target a
fork — the criterion as written silently assumes origin is writable.

## D2 — R4 "any item with 2 failed fix attempts is flagged and abandoned" is not testable on demand

**What happened:** this is a policy property — it only manifests when a fix genuinely
fails twice, which can't be staged honestly in a read-only run. The rule is encoded in
the command text (step 4).
**Proposed amendment:** reword the criterion to "the command text encodes the
two-strike rule, and the first naturally-occurring FLAGGED item is linked here as
evidence when it happens" — an acceptance box should not require manufacturing failures.

## D3 — R2's default hook (`npm run format --if-present || true`) is unfalsifiable when misconfigured

**What happened:** not hit on hono (its real formatter was wired: `bun run format:fix`),
but the starter default silently no-ops on any repo without a `format` script — the
criterion "observe the hook fire" can never fail, it just fires vacuously. Related cost
note: hono's prettier runs with `--cache`, so repo-wide format-on-every-edit is fast
here (~1s warm); on repos without caching this hook shape could be slow.
**Proposed amendment:** starter README should tell adopters to replace `--if-present`
with the real formatter command during Day-0 setup (making a missing formatter loud),
and prefer changed-file or cached formatting on large repos.

## D4 — R2 `"model": "opusplan"` — verified VALID, no deviation

Flagged pre-run as a risk; resolved against current official docs: `opusplan` is a
documented model alias and the `model` setting accepts aliases. Criterion stands as
written. (Kept here so the pre-run flag has a recorded resolution.)

## D5 — R3 "unrelated staged changes trigger a question" — RESOLVED

**What happened:** initially untested (honest gap, not a criterion defect). Closed in
the fork run: /ship verified green, then stopped with a three-option question and
created no commit ([FORK-RUN.md](FORK-RUN.md) §3).

## Process notes worth keeping

- A shallow clone (`--depth 1`) was sufficient for every Phase 1 requirement —
  full history added nothing. Worth a line in the IMPLEMENTATION guide for large repos.
- The refusal demo is only meaningful if the session HAS commit permissions —
  granting them and watching the command decline is the evidence. A sandboxed refusal
  proves nothing.
- Blocking pushes at the git level (`git remote set-url --push origin no_push://blocked`)
  is a cheap, reliable safety lock for bootstrap runs on third-party repos.
