# GK skill library — scope roadmap
### v1.2 shipped · deepening and SDLC expansion queued

The library's scope grows on three axes. New skills land when their spec is solid
(gk-migrate, gk-incident, gk-release shipped in v1.2); deepening lands skill-by-skill
so quality never dilutes; every addition obeys the PRD guardrails (human gates,
security report-only, two-strike limits) and the routing-only description standard.

## Axis 1 — New skills (queued, in priority order)

| Skill | Stage | One-liner | Gate before building |
|---|---|---|---|
| `gk-security-review` | Ship | Pre-merge security pass — injection surfaces, secrets, authz gaps; **report-only by design** (PRD non-goal #2) | Rubric agreed: what blocks vs. what reports |
| `gk-observe` | Operate | Instrumentation planner: what to log/measure per feature, alert thresholds, detection-gap review (feeds gk-incident Step 5) | One real postmortem to calibrate against |
| `gk-monorepo` | Build | Root + per-package grounding hierarchy, CODEOWNERS-aware (implements PRD R17) | R17 design note resolved |
| `gk-onboard` | Close | Developer onboarding packages from the gk/ index — the human-newcomer counterpart of gk-init | gk-init + gk-document stable post-rename |
| `gk-compliance` | Operate | Evidence collection for audits (SOC2-style): control → artifact mapping from repo history | Real audit checklist to build against |

## Axis 2 — Deepening the existing 29 (per-skill upgrades)

Highest-leverage first; each is a self-contained PR:

1. **gk-fix-bug** — add flaky-test playbook (reproduce-under-load, quarantine
   protocol) and a production-incident entry point that accepts a gk-incident handoff.
2. **gk-graph** — per-package graphs with a cross-package edge index (the R17
   monorepo design); incremental update benchmarks documented.
3. **gk-test** — mutation-testing pass as an optional depth level; contract-test
   templates for service boundaries.
4. **gk-deploy** — rollback rehearsal step (prove the undo before the do — pairs
   with gk-release Step 5); add bare-VPS and Kubernetes targets.
5. **gk-perf** — budget files (`gk/perf/budgets.json`) so regressions fail
   verification instead of surfacing in review.
6. **gk-parallel** — worktree-per-wave isolation (matching the proof-run pattern)
   and cost annotation fed from gk-cost.
7. **gk-design / gk-design-md** — component-library extraction mode (shadcn/tokens)
   beyond page-level capture.
8. **gk-doctor** — pluggable check packs per stack (Python/uv, Go, Rust) beyond the
   current JS/TS focus.

Deepening standard: every upgrade adds at least one new `references/` playbook, keeps
the frontmatter description routing-only, and ships with a worked example.

## Axis 3 — Full SDLC positioning

With v1.2 the library covers: **Plan** (brainstorm, architect, agent, spec-review) →
**Build** (new-app, add-feature, change-spec, fix-bug, review, migrate) → **Design**
(design, design-md) → **Ship** (test, e2e, perf, deploy, release) → **Operate**
(doctor, incident; observe queued) → **Visibility** (progress, cost, ledger, graph,
mode) → **Close** (document, changelog, handoff). Remaining gaps are Axis-1 items:
security-review, observability, compliance, onboarding.

---

*Additions follow the same discipline as everything else in the stack: spec first,
one PR per skill, gk-reviewer gate, and a Learned Rules line when reality disagrees
with the plan.*
