# skills-extra — the full driver set

Same rules as [`skills-library/`](../skills-library/README.md): install per pain
(`cp -r skills-extra/<name> <repo>/.claude/skills/`), one review gate, one grounding
entry point, and every installed skill costs always-on context — so install what you
use, not the set.

## By lifecycle stage (21 skills)

**Plan** — `gk-brainstorm` (idea → buildable brief) · `gk-architect` (structure before
code) · `gk-agent` (multi-agent system design) · `gk-spec-review` (audit specs before coding)

**Build** — `gk-new-app` (from scratch) · `gk-add-feature` (into existing code) ·
`gk-change-spec` (requirements changed mid-build) · `gk-review` (evidence-based review
gate — swaps with gk-reviewer, never both)

**Design** — `gk-design` (editorial-quality frontend) · `gk-design-md` (capture a
design system from any URL)

**Ship** — `gk-e2e` (Playwright end-to-end) · `gk-deploy` (7 platforms) ·
`gk-release` (gated release cutting, drafts only — new in v1.2)

**Operate** — `gk-incident` (severity triage → mitigation-first → postmortem →
Learned Rules — new in v1.2)

**Visibility** — `gk-progress` (ASCII dashboard) · `gk-cost` (token/cost tracking) ·
`gk-ledger` (visual cost report) · `gk-mode` (manual/autonomous execution mode)

**Close** — `gk-document` (docs generation) · `gk-changelog` (append-only changelog) ·
`gk-handoff` (client handoff packages)

The large-codebase drivers (`gk-init`, `gk-graph`, `gk-parallel`, `gk-fix-bug`,
`gk-test`, `gk-perf`, `gk-doctor`, `gk-migrate`) live in [`skills-library/`](../skills-library/).
Historical origin doc: [VIBE-PACK-README.md](VIBE-PACK-README.md).
