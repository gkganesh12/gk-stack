# PRD Phase 1 acceptance checklist — honojs/hono proof run

**Executed:** 2026-07-04 · shallow clone of honojs/hono at `a05813c` · bootstrap branch `gk/bootstrap`
**Executor:** Claude Code, supervised session · pushes physically blocked (`no_push://blocked`) pending human sign-off
Boxes are checked only where the acceptance criterion was demonstrated as written; anything short of that is in [DEVIATIONS.md](DEVIATIONS.md).

## R1 — Grounding file (CLAUDE.md)

- [x] `CLAUDE.md` exists at repo root, ≤200 lines, zero `<<PLACEHOLDER>>` strings remain
      — 51 lines ([CLAUDE.md](CLAUDE.md), the actual artifact)
- [x] Contains sections: Stack, Commands, Verification, Conventions, Workflow, Don't, Learned Rules — all seven present
- [x] Every command listed under Commands executes successfully in this repo
      — `bun run test` (exit 0, 4,579 tests), `bun run format` ("All matched files use Prettier code style!"), `bun run lint` (exit 0, 0 errors/39 warnings — `no-explicit-any` is warn-level in @hono/eslint-config), `bun install` (773 packages). `bun run build` verified to exist, not run (mutates dist/); per-runtime `test:deno`/`test:workerd`/etc. need external runtimes — listed with that caveat
- [x] No invented conventions — evidence per convention:
      1. Directory-per-module + colocated tests → `src/middleware/cors/` (index.ts + index.test.ts), `src/middleware/etag/`, `src/utils/url.ts` + `url.test.ts` (121 of 307 files under src/ are colocated tests)
      2. Vitest globals + `app.request()` style → `src/middleware/etag/index.test.ts` (no test-fn imports), `vitest.config.ts` (`globals: true`), `src/compose.test.ts`
      3. Web Standards only in core; runtime code in src/adapter/* → grep for `node:` in src/ hits only adapter files + context-storage's node:async_hooks
      4. `@module` JSDoc + full JSDoc on exports → `src/middleware/cors/index.ts`, `src/middleware/context-storage/index.ts`, `src/index.ts`
      5. `import type` enforced + exports-map maintenance → @hono/eslint-config (`consistent-type-imports`: error), package.json `exports`/`typesVersions` + jsr.json

## R2 — Settings & guardrails (.claude/settings.json)

- [x] Valid JSON (`python3 json.load` pass); `"model": "opusplan"` set — verified valid against current docs: opusplan is a documented model alias ("uses `opus` during plan mode, then switches to `sonnet` for execution") and the `model` setting accepts aliases
- [x] Allow-list covers this repo's real commands — `bun run test/test:*/lint/format/...`; example `npm` entries replaced
- [x] Deny-list blocks `--no-verify` commits, force-push, recursive delete, `.env*` and secrets paths
- [x] PostToolUse hook runs this repo's actual formatter (`bun run format:fix || true`) after Write|Edit — **demonstrated:** scratch file `src/gk-hook-demo.ts` created with prettier violations (`const greeting = "hello hook demo";`); headless session instructed to ONLY append a comment line via Edit; after the session the pre-existing lines read `const greeting = 'hello hook demo'` (single quotes, no semicolons) — only the hook explains the reformatting

## R3 — Ship command (/ship)

- [x] Failing test ⇒ no commit, failure reported — **demonstrated with full commit permissions granted**, so refusal was the command's discipline, not a sandbox artifact; HEAD unchanged after the session ([SHIP-REFUSAL-TRANSCRIPT.md](SHIP-REFUSAL-TRANSCRIPT.md)); scratch branch deleted after
- [x] Passing verification ⇒ conventional commit on a branch (never main), PR opens via gh, only the link returned — completed on the fork after sign-off: commit `bc196af`, [PR #1 against gkganesh12/hono main](https://github.com/gkganesh12/hono/pull/1) ([FORK-RUN.md](FORK-RUN.md) §2; demo PR closed after capture)
- [x] Unrelated staged changes trigger a question — demonstrated on the fork: /ship verified green, then stopped with a three-option question, no commit created ([FORK-RUN.md](FORK-RUN.md) §3)

## R4 — Triage command (/triage)

- [x] Degrades gracefully read-only — run against live upstream with read-only gh tools; digest classified real CI runs, issues, and PRs, marked P2 fixes SKIPPED (read-only mode), and listed sources it could not fully reach ([TRIAGE-DIGEST.md](TRIAGE-DIGEST.md))
- [x] P2 fixes as draft PRs from worktrees — completed on the fork: one lint chore fixed in worktree branch `gk-proof/triage-language-lint`, verified (4,580 tests), [draft PR #2 against fork main](https://github.com/gkganesh12/hono/pull/2) ([FORK-RUN.md](FORK-RUN.md) §4; demo PR closed after capture)
- [x] Security-related findings report-only — no security findings surfaced in this run; rule encoded in the command text (step 6)
- [ ] Two-strike flag-and-abandon — not demonstrable on demand; policy encoded in command text (step 4); criterion rewording proposed (D2)
- [x] Single digest, severity-ordered P0→noise, items linked — verified in TRIAGE-DIGEST.md

## R5 — Reviewer skill (gk-reviewer)

- [x] Skill present with valid frontmatter; adapted with hono-specific review-blocking rules (zero-dependency, no Node-only APIs in core, colocated tests)
- [x] Dry-run review of the most recent merged PR (#5085) produced a SHIP verdict with findings limited to the skill's contract — and, notably, zero invented findings on a deps-bump PR ([REVIEW-SAMPLE.md](REVIEW-SAMPLE.md))

## R6 — Verification wiring

- [x] Verification exits non-zero when a test is deliberately broken, zero when restored — broken: exit 1 (`Tests 1 failed | 4579 passed`); restored: exit 0; scratch branch cleaned up
- [x] UI clause — N/A stated explicitly in CLAUDE.md: library with no UI; "types + tests are the entire verification story"

**Score after the fork run: 17 of 18 boxes checked as written. The one remaining (R4 two-strike) is a policy property, not demonstrable on demand — rewording proposed in [DEVIATIONS.md](DEVIATIONS.md) D2. Every deviation flagged, none silently adapted.**
