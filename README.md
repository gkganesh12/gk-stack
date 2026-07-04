# GK-Stack
### The Grounded Knowledge Stack — an operating system for AI-assisted development

Most AI-coding advice is a blog post. GK-Stack is an **operating system you install**:
a seven-layer method, an executable PRD that an agent implements in your repo under
supervision, and guardrails that make unattended automation safe. Skills are just the
drivers — useful, optional, and never the point.

**Proof before promises:** we ran the PRD's Phase 1 on [honojs/hono](https://github.com/honojs/hono)
(live public repo, 4,579-test suite) and kept everything —
the [populated grounding file](examples/hono/CLAUDE.md),
the [acceptance checklist with evidence per box](examples/hono/PHASE1-CHECKLIST.md),
the [verbatim transcript of `/ship` refusing to commit on a red test suite](examples/hono/SHIP-REFUSAL-TRANSCRIPT.md),
a [triage digest of real upstream noise](examples/hono/TRIAGE-DIGEST.md),
a [fresh-eyes review with zero invented findings](examples/hono/REVIEW-SAMPLE.md),
and the [criteria that failed as written](examples/hono/DEVIATIONS.md) — flagged, not hidden.

## Your first hour

1. **Copy `starter/` contents** (including `.claude/`) into your repo root. That's the
   whole spine: `CLAUDE.md` template, `settings.json` (permissions + format hook +
   `opusplan`), `/ship`, `/triage`, and one skill — `gk-reviewer`.
2. **Let the agent fill its own grounding file:** open Claude Code and run the
   CLAUDE.md fill-in prompt from [docs/GK-STACK-IMPLEMENTATION.md](docs/GK-STACK-IMPLEMENTATION.md) §2.
   Real versions from lockfiles, real commands, conventions traceable to code — no inventions.
3. **Smoke-test the loop:** ask for something trivial. Plan mode → Opus plans → approve →
   Sonnet executes → the hook auto-formats → `/ship` runs verification before committing.
4. **Watch `/ship` earn its keep.** Break a test on a scratch branch and invoke it.
   It should refuse — [here's exactly what that looks like](examples/hono/SHIP-REFUSAL-TRANSCRIPT.md).

For the fully automated setup: plan mode → *"Implement docs/GK-STACK-PRD.md, Phase 1 only.
Plan first."* The PRD is written to be executed by the agent with a human reviewing.

## What's inside — the hierarchy is the point

```
gk-stack/
├── docs/                              # THE OPERATING SYSTEM
│   ├── GK-STACK.md                    #   the method — 7 layers, every claim sourced
│   ├── GK-PRINCIPLES.md               #   the 7 layers, tool-agnostic
│   ├── GK-STACK-IMPLEMENTATION.md     #   hands-on: model routing, 4-week rollout, loops
│   ├── GK-STACK-PRD.md                #   executable spec — hand it to the agent
│   └── token-efficient-vibe-coding.md #   the token-economics primer
├── starter/                           # THE SPINE — copy into any repo root
│   └── CLAUDE.md · settings.json · /ship · /triage · gk-reviewer (the only always-on skill)
├── examples/hono/                     # THE PROOF — Phase 1 executed on a real repo
├── skills-library/                    # THE DRIVERS — curated 7, install per pain
│   └── README.md                      #   "install when you hit this pain" table
└── vibe-skills-extra/                 # the remaining 19 drivers, same rules
```

The starter deliberately ships **one** always-on skill. Skill descriptions load into
every session's context; a stack whose C-layer is "context is a budget" doesn't
preinstall 26 of them. When a pain shows up — legacy onboarding, oversized context,
parallel work — [pull the matching driver](skills-library/README.md).

## Two rules that keep it coherent

- **One review gate.** `gk-reviewer` ships active. Prefer `vibe-review`? Swap — never
  run both. Record the choice in CLAUDE.md → Learned Rules. (PRD R15.)
- **One grounding entry point.** CLAUDE.md stays the ≤200-line front door; the `vibe/`
  folder vibe-init generates is the deep index it points to.

## One team, whole system

The GK-Stack method **and** the vibe-* driver library are built by the same team —
**Ganesh Khetawat & Aakash Dhar** ([BetaCraft](https://betacraft.in)). The method
wasn't written around someone else's skills, and the skills weren't bolted onto
someone else's method: the guardrails in the PRD are the same ones the drivers obey.
Original pack README preserved at [vibe-skills-extra/VIBE-PACK-README.md](vibe-skills-extra/VIBE-PACK-README.md).

The method itself is distilled from named sources — Anthropic's published team
playbook, Claude Code best-practices docs, Boris Cherny's workflow, Simon Willison's
agentic patterns — full list with links in [docs/GK-STACK.md](docs/GK-STACK.md#sources-the-grounded-truth).
All 11 citation URLs verified live 2026-07-04.

---

v1.1 · July 2026 · Claude Code is the reference implementation; the
[principles](docs/GK-PRINCIPLES.md) are tool-agnostic. Verify tool specifics at
code.claude.com/docs as versions move.
