# skills-library — the driver library

The GK-Stack operating system is the method, the executable PRD, and the guardrails.
These skills are its **drivers**: install one when you hit the pain it solves, not before.
Every skill you install adds its description to every session's context — that's the
whole reason this library is separate from the starter spine.

## Install when you hit this pain

| You're feeling this | Install | What it does |
|---|---|---|
| "New agent sessions are lost in this legacy codebase" | `vibe-init` | Reads the actual source, generates grounding docs (CLAUDE.md + `vibe/` deep index) from observed code only |
| "The repo is too big — every session drowns in context" | `vibe-graph` | Dependency graph with confidence tags and god-node detection; feeds targeted context slices to other skills |
| "I have independent tasks that could run at once" | `vibe-parallel` | Wave-based subagent execution with file-conflict detection |
| "This bug needs more than a one-line fix" | `vibe-fix-bug` | Spec-driven diagnosis → regression test → fix, with severity triage |
| "What did this change actually affect?" | `vibe-test` | Blast-radius-aware test generation across everything the change touches |
| "It's slow and I don't know where" | `vibe-perf` | Full-stack performance audit with tracked scores across runs |
| "The app won't even start" | `vibe-doctor` | Environment health check with safe auto-remediation |

## Install (per skill, 10 seconds)

```bash
cp -r skills-library/<skill-name> <your-repo>/.claude/skills/
```

Or user-wide: `cp -r skills-library/<skill-name> ~/.claude/skills/`. Restart Claude Code.

## The two coherence rules (PRD R15)

1. **One review gate.** The starter ships `gk-reviewer`. If your team prefers
   `vibe-review` (in `vibe-skills-extra/`), swap — never run both.
2. **One grounding entry point.** If `vibe-init` generates its `vibe/` folder,
   CLAUDE.md stays the ≤200-line front door that points to it — conventions are
   never duplicated across both.

The remaining 19 vibe-* skills (brainstorm, architect, e2e, deploy, handoff, …)
live in `vibe-skills-extra/` — same install pattern, same rules.
