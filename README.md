# GK-Stack Bundle v1.1
### Ganesh's Stack — the Grounded Knowledge Stack for AI development on large, complex codebases

Everything in one place: the method, the how-to, the executable spec, and a
batteries-included starter kit with the curated skill library already installed.

## What's inside

```
gk-stack/                              # repo root — version lives in git tags
├── docs/
│   ├── GK-STACK.md                    # The method — 7 layers, grounded in Anthropic team,
│   │                                  #   Boris Cherny, and community sources
│   ├── GK-STACK-IMPLEMENTATION.md     # Hands-on guide: Sonnet/Opus routing, opusplan,
│   │                                  #   4-week rollout, loops & triage, prompt library
│   ├── GK-STACK-PRD.md                # v1.1 executable spec — hand it to Claude Code
│   └── token-efficient-vibe-coding.md # Bonus: the token-economics primer
├── starter/                           # Drop into any repo root
│   ├── README.md                      # Kit install guide
│   ├── CLAUDE.md                      # Grounding-file template (fill placeholders)
│   └── .claude/
│       ├── settings.json              # opusplan default, permissions, format hook
│       ├── commands/ship.md           # /ship — verify → commit → push → PR
│       └── skills/
│           ├── gk-reviewer/           # Fresh-eyes review gate
│           ├── vibe-init/             # Legacy-codebase onboarding (grounding at scale)
│           ├── vibe-graph/            # Dependency graph, god nodes, context slicing
│           ├── vibe-parallel/         # Conflict-safe subagent waves
│           ├── vibe-fix-bug/          # Spec-driven bug diagnosis & fix
│           ├── vibe-test/             # Blast-radius-aware test generation
│           ├── vibe-perf/             # Full-stack performance audit
│           └── vibe-doctor/           # Environment health check
└── vibe-skills-extra/                 # The remaining 19 vibe-* skills — install per taste
                                       #   (brainstorm, architect, e2e, deploy, handoff, ...)
```

## Quick start (10 minutes)

1. Copy `starter/` contents (including `.claude/`) into your repo root.
2. Open Claude Code there, run the CLAUDE.md fill-in prompt from
   `docs/GK-STACK-IMPLEMENTATION.md` §2 Step 3 — or, for a large/legacy
   codebase, just say **"vibe-init"** and let it generate grounding docs
   from the observed code.
3. `/model opusplan` (Opus plans, Sonnet executes — set already in settings.json).
4. For the full automated setup: plan mode → *"Implement docs/GK-STACK-PRD.md,
   Phase 1 only. Plan first."*

## Two rules that keep the bundle coherent

- **One review gate.** `gk-reviewer` ships active. If your team prefers
  `vibe-review` (in extras), swap — never run both. Record the choice in
  CLAUDE.md → Learned Rules. (PRD R15.)
- **One grounding entry point.** CLAUDE.md stays the ≤200-line front door;
  the `vibe/` folder that vibe-init generates is the deep index it points to.

## Attribution & sources

- GK-Stack method and vibe-* skill library by **Ganesh Khetawat & Aakash Dhar** —
  one team ships both the method and the driver library. Original pack README
  preserved at `vibe-skills-extra/VIBE-PACK-README.md`.
- The method is distilled from Anthropic's published team playbook and
  best-practices docs, Boris Cherny's workflow, Simon Willison's agentic
  patterns, and community consensus — full source list in docs/GK-STACK.md.

v1.1 · July 2026 · Verify tool specifics at code.claude.com/docs as versions move.
