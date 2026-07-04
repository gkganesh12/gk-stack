# PRD: GK-Stack Bootstrap
### Agent-implemented repo automation — grounding, shipping, looping, and triage

**Version:** 1.1 · July 2026 · Status: Ready for implementation (v1.1 adds skill-library integration R15 and large-codebase requirements R16–R18)
**Implementer:** Claude Code (supervised by a human tech lead)
**Companions:** GK-STACK.md (method) · GK-STACK-IMPLEMENTATION.md (manual walkthrough) · gk-stack-starter.zip (file templates)

---

## How to execute this PRD with Claude Code

This document is written to be implemented *by* the agent, in the target repo:

1. Place this file (and the starter kit contents) in the repo root. Open `claude` there with `opusplan` active.
2. Enter plan mode and say: *"Implement GK-STACK-PRD.md, Phase 1 only. Plan first."*
3. Implement phase by phase. After each requirement, **run its acceptance criteria and check the boxes in this file** — it is a living document.
4. Any **blocking open question** (§Open Questions) that can't be answered from the repo: stop and ask the human. Do not guess.
5. **Non-goals are binding.** Do not widen scope, however tempting.
6. Loops (R7, R8) are **configured but never scheduled by the agent** — print the exact command for the human to run. Unattended automation starts on human action only.

---

## Problem Statement

Developers using AI coding agents on this repo lose money and quality to the same failure modes: agents re-learn project conventions every session, execute unplanned work on expensive models, ship unverified changes, repeat corrected mistakes, and — once automation loops enter the picture — burn unattended budget or take unsafe actions. The cost of not solving it compounds daily: token spend on re-teaching and correction loops, review time on preventable defects, and repeated manual triage of CI failures, issues, and PR comments that an agent could classify and largely resolve.

## Goals

1. **One-session onboarding:** any agent session in this repo starts fully grounded (stack, commands, conventions, learned rules) with zero human re-explanation — measured by a populated CLAUDE.md under 200 lines.
2. **Verified shipping only:** ≥80% of agent-authored commits go through `/ship`, and 100% of `/ship` invocations block on failed verification.
3. **Compounding knowledge:** corrected mistakes stop recurring — Learned Rules grows weekly and repeat-mistake incidents trend to zero within a month.
4. **Cheap execution, smart planning:** Opus tokens concentrate in plan mode and escalations; routine execution and all unattended loops run on Sonnet/Haiku.
5. **Triage without toil:** daily repo noise (CI failures, issues, PR comments) is classified automatically, safe chores are fixed as draft PRs, and the human decision load reduces to one ≤2-minute digest.

## Non-Goals

- **No auto-merge, auto-deploy, or direct pushes to main by any automation.** Every automated path ends at a human gate (draft PR, digest, comment). Rationale: trust is earned up the ladder; v1 optimizes safety over autonomy.
- **No auto-fixing of security findings** (scanner output, vulnerable-dependency alerts, authz issues). Report-only, always. Rationale: highest blast radius, lowest tolerance for agent error.
- **No CI-platform integration (GitHub Actions @claude reviews, event-driven cloud sessions) in v1.** Deferred to P2. Rationale: valuable but environment-dependent; core value ships without it.
- **No custom model gateway, spend dashboards, or fine-tuning.** Model routing is handled with built-ins (`opusplan`, `/model`, per-loop model choice). Rationale: built-ins cover 95% of the need at zero maintenance cost.
- **No multi-repo rollout in v1.** This PRD targets one repo; a rollout template is P2. Rationale: prove the pattern before propagating it.

## User Stories

- As a **developer**, I want every agent session to already know our stack, commands, and conventions, so that I stop paying tokens and attention to re-explain them.
- As a **developer**, I want a single `/ship` command that verifies before committing, so that unverified work physically cannot reach a PR.
- As a **tech lead**, I want agent mistakes converted into persistent rules, so that the same defect never needs reviewing twice.
- As a **tech lead**, I want repo noise triaged into one morning digest with safe chores already fixed as draft PRs, so that my decision time drops to minutes.
- As a **security-conscious lead**, I want automation constrained by versioned permissions, denied dangerous commands, and report-only handling of security findings, so that velocity never becomes an incident.
- As a **teammate reviewing agent PRs**, I want a fresh-context reviewer that flags only correctness and requirement gaps, so that reviews are signal, not style noise.

---

## Requirements

### Must-Have (P0) — Phase 1: the spine

**R1 — Grounding file (`CLAUDE.md`)**
Populate the starter template from the actual codebase: stack with exact versions from lockfiles, real commands, 3–5 observed conventions, Verification section, Don't list, empty append-only Learned Rules section.
Acceptance criteria:
- [ ] `CLAUDE.md` exists at repo root, ≤200 lines, zero `<<PLACEHOLDER>>` strings remain
- [ ] Contains sections: Stack, Commands, Verification, Conventions, Workflow, Don't, Learned Rules
- [ ] Every command listed under Commands executes successfully in this repo (or is marked `TODO(human)` with a reason)
- [ ] No invented conventions: each Conventions line is traceable to existing code (agent lists the evidence file per convention when checking this box)

**R2 — Settings & guardrails (`.claude/settings.json`)**
Adapt the starter settings to this repo's toolchain; set the team default model.
Acceptance criteria:
- [ ] Valid JSON; `"model": "opusplan"` set
- [ ] Allow-list covers this repo's real test/build/lint/typecheck commands; example `npm` entries replaced
- [ ] Deny-list blocks: `--no-verify` commits, force-push, recursive delete, reading `.env*` and secrets paths
- [ ] PostToolUse hook runs this repo's actual formatter after Write|Edit; verified by editing a scratch file and observing the hook fire

**R3 — Ship command (`.claude/commands/ship.md`)**
Verify → commit → push → PR, with pre-computed git context.
Acceptance criteria:
- [ ] Given a branch with an intentionally failing test (scratch branch), when `/ship` runs, then no commit is created and the failure is reported (demonstrate, then delete the scratch branch)
- [ ] Given passing verification, when `/ship` runs, then a conventional commit is created, a branch is used (never main), a PR opens via `gh`, and only the PR link is returned
- [ ] Unrelated staged changes trigger a question, not a silent commit

**R4 — Triage command (`.claude/commands/triage.md`)** *(new — build from the pattern in GK-STACK-IMPLEMENTATION.md §5)*
On-demand triage: gather CI failures, open issues, unanswered PR comments → classify P0/P1/P2/noise → fix P2 chores in isolated worktrees as draft PRs → P0/P1 decision briefs → one severity-ordered digest.
Acceptance criteria:
- [ ] Runs read-only against sources it cannot reach (degrades gracefully, states what it could not gather)
- [ ] P2 fixes land only as draft PRs from worktrees; nothing touches main; no merges
- [ ] Security-related findings appear in the digest as report-only, regardless of classification
- [ ] Any item with 2 failed fix attempts is flagged and abandoned, not retried
- [ ] Digest is a single output, ordered P0→noise, each item linked

**R5 — Reviewer skill (`.claude/skills/gk-reviewer/SKILL.md`)**
Install and adapt: reference this repo's Conventions/Learned Rules explicitly.
Acceptance criteria:
- [ ] Skill present with valid frontmatter (name + trigger description)
- [ ] Dry-run review of the most recent merged PR produces a SHIP/FIX-FIRST verdict citing file:line findings only for correctness/requirement/rule/security gaps

**R6 — Verification wiring**
The Verification command in CLAUDE.md is real and failure-sensitive.
Acceptance criteria:
- [ ] Verification command exits non-zero when a test is deliberately broken on a scratch branch, and zero when restored (demonstrate both, clean up after)
- [ ] For UI-bearing repos: Verification section states how the agent can observe rendered output (dev-server URL or browser tooling), or `TODO(human)` if none exists

### Nice-to-Have (P1) — Phase 2: loops, after one week of trust

**R7 — PR babysitter loop (configure, do not schedule)**
Materialize prompt P5 as a documented, ready-to-run `/loop` invocation: watches open PRs, fixes formatting/lint/type-level CI failures and addresses review comments in per-PR worktrees, two-strike stop, never merges, security report-only. **Model: Sonnet.**
Acceptance criteria:
- [ ] `docs/loops.md` (or CLAUDE.md appendix) contains the exact loop command, its model, its permission scope, and its stop conditions
- [ ] Agent has verified the loop's permission needs against `.claude/settings.json` and listed any human approvals required
- [ ] The loop is NOT running; the human-run command is printed at the end of Phase 2

**R8 — Morning triage digest loop (configure, do not schedule)**
Materialize prompt P6: scheduled version of R4 with draft-PR-only powers. **Model: Haiku (digest/classification) or Sonnet if fix quality requires it.**
Acceptance criteria:
- [ ] Documented next to R7 with model, scope, cadence, and trust-ladder status ("read-only week 1")
- [ ] Digest format matches R4's; loop inherits R4's two-strike and security rules verbatim

**R9 — Simplify command (`/simplify`)**
Post-implementation cleanup pass on the current diff only: dead code, needless abstraction, naming — behavior-preserving, verified by R6 before returning.
Acceptance criteria:
- [ ] Refuses to run with a dirty verification state; touches only files already in the diff

**R10 — Learn command (`/learn`)**
One-invocation wrapper for the learned-rule ritual (prompt P3): append a single terse rule to CLAUDE.md's Learned Rules.
Acceptance criteria:
- [ ] Appends exactly one line per invocation; never edits other sections; rejects prose >1 line

**R15 — Skill library integration (vibe-* pack, large-codebase set)**
Install the curated subset of the vibe-* framework (Aakash Dhar / BetaCraft) that serves large, complex codebases, and resolve overlaps with GK-Stack primitives so the two systems don't fight.
Curated set: `vibe-init` (legacy onboarding — generates grounding docs from observed code only), `vibe-graph` (dependency graph with confidence tags + god nodes; feeds context slicing), `vibe-parallel` (wave-based subagent execution with conflict detection), `vibe-fix-bug`, `vibe-test` (blast-radius-aware), `vibe-perf`, `vibe-doctor`. Optional per team taste: `vibe-brainstorm`, `vibe-architect`, `vibe-document`, `vibe-changelog`.
Acceptance criteria:
- [ ] Curated skills installed under `.claude/skills/` (or `~/.claude/skills/` per team policy) and listed in CLAUDE.md with one-line "when to use" each
- [ ] **Exactly one review gate:** either `gk-reviewer` or `vibe-review` is active, not both — the choice and rationale recorded in Learned Rules
- [ ] **Exactly one grounding authority:** if `vibe-init` generates its `vibe/` folder, CLAUDE.md references it as the deep index and stays the ≤200-line entry point (no duplicated conventions)
- [ ] Trigger-collision pass done: skill descriptions checked so no two skills claim the same trigger phrases; conflicts resolved by editing descriptions
- [ ] `vibe-mode` autonomous execution, if installed, is subordinated to GK guardrails: R2 permissions and the non-goals (no auto-merge/deploy, security report-only) explicitly override it

### Future Considerations (P2) — Phase 3: design for, don't build yet

- **R11 — CI-integrated review:** @claude PR reviews via the repo host's actions, feeding findings to `/learn`. *Design note: keep gk-reviewer's output format machine-parseable so CI can consume it later.*
- **R12 — Weekly dependency audit loop:** outdated packages → draft PRs; vulnerable packages → report-only briefs (non-goal #2 applies permanently).
- **R13 — Agent action audit trail:** append-only log location for loop actions + a monthly spend-split review (Opus share vs plan-mode share). *Design note: R7/R8 docs should already state where their run output lands.*
- **R14 — Multi-repo rollout template:** parameterized version of Phase 1 runnable against a fresh repo.
- **R16 — Large-scale migration campaign skill (`gk-migrate`):** codifies the plan → 3-file pilot → headless batch (`claude -p` per file, Sonnet/Haiku, scoped tools) → verify → rollup-PR pattern for repo-wide codemods across thousands of files. *Design note: pilot results must gate the batch; per-file failures logged, never retried more than twice.*
- **R17 — Monorepo grounding hierarchy:** root CLAUDE.md as the ≤200-line entry point + per-package CLAUDE.md files scoped to ownership boundaries (CODEOWNERS-aware); `vibe-graph` runs per package with a cross-package edge index. *Design note: R1 should already write the root file assuming children may exist.*
- **R18 — Code-intelligence plugin:** for typed languages at scale, install an LSP/code-intelligence plugin (per official Claude Code best practices) so agents get precise symbol navigation and post-edit error detection instead of grep-based guessing.

---

## Success Metrics

**Leading (evaluate at 2 weeks):**
- 100% of P0 acceptance boxes checked, each with the demonstrating evidence noted inline
- ≥70% of non-trivial tasks begin in plan mode (spot-check session transcripts)
- Plan one-shot rate ≥60% (approved plans that execute without human-directed rework)
- ≥80% of agent commits authored via `/ship`; 0 unverified commits from agent sessions
- Triage digest read time ≤2 minutes (human-reported)

**Lagging (evaluate at 30 and 60 days):**
- Learned Rules: +2–5/week initially, then plateauing as mistakes stop recurring; zero repeat incidents of any written rule
- Token economics: Opus ≤30% of total tokens while ≥70% of plan-mode tokens; correction-loop spend (re-work on failed attempts) down 40%+ vs the pre-GK baseline month
- Review load: median human time-to-decision on agent PRs down 30%+
- Stretch: one full week where all P2-class chores shipped exclusively through loops' draft PRs

*Measurement:* session transcripts + `/cost` (API) or plan usage view; git log for `/ship` adoption; CLAUDE.md diff history for rules.

## Open Questions

- **[Repo owner — BLOCKING P0]** What are the canonical test / lint / format / build commands and package manager? (Agent should infer from lockfiles and CI config first; ask only if ambiguous.)
- **[Repo owner — BLOCKING P0/R3]** Is `gh` CLI available and authenticated, or is this GitLab/other? If other, `/ship` and `/triage` PR steps need the equivalent CLI named.
- **[Security/lead — BLOCKING P1]** Approve the loop permission scopes and the draft-PR-only policy in writing (a line in docs/loops.md is sufficient) before any loop is scheduled.
- **[Team — non-blocking]** Subscription quota or API billing? Affects whether R8 defaults to Haiku (API cost) or Sonnet (quota simplicity).
- **[Team — non-blocking]** Monorepo? If yes, decide root-plus-package CLAUDE.md layering during Phase 1, defaulting to root-only.

## Timeline & Phasing

- **Phase 1 (Day 0, one supervised agent session, ~1–2 h):** R1–R6. Human reviews and merges the bootstrap PR. Hard gate: all P0 boxes checked with evidence.
- **Phase 2 (Week 2, after one week of daily-rhythm usage):** R7–R10 configured; human schedules R8 read-only first, R7 after R8 earns trust. Gate: security sign-off question answered.
- **Phase 3 (Month 2):** pick from R11–R14 based on observed pain; each gets its own mini-spec against this document's non-goals.
- **Dependencies:** repo host CLI auth (R3, R4, R7); CI log access (R4, R7); nothing external for R1/R2/R5/R6.

---

*Scope discipline note for the implementing agent: if a requirement here conflicts with something discovered in the repo, do not silently adapt — surface the conflict as an open question. If an improvement occurs to you mid-build, add it to a "Parking lot" section at the bottom of this file instead of building it.*
