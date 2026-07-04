# GK-Stack
### The Grounded Knowledge Stack — an operating system for AI-assisted development

Most AI-coding advice is a blog post. GK-Stack is an **operating system you install**:
a seven-layer method, an executable PRD that an agent implements in your repo under
supervision, guardrails that make unattended automation safe, and a 29-skill driver
library — installed per pain, never preloaded.

**Proof before promises.** We ran the PRD's Phase 1 on [honojs/hono](https://github.com/honojs/hono)
(live public repo, 4,579-test suite): **17 of 18 acceptance boxes passed as written**,
and the one that didn't is [documented, not hidden](examples/hono/DEVIATIONS.md).
The evidence is all here — the [populated grounding file](examples/hono/CLAUDE.md),
the [checklist with proof per box](examples/hono/PHASE1-CHECKLIST.md),
the [verbatim transcript of `/ship` refusing to commit on a red test suite](examples/hono/SHIP-REFUSAL-TRANSCRIPT.md),
a [triage digest of real repo noise](examples/hono/TRIAGE-DIGEST.md),
a [fresh-eyes review with zero invented findings](examples/hono/REVIEW-SAMPLE.md),
and a [predicted-vs-actual ledger](examples/NOTES.md).

## The seven layers

The name spells the method:

| | Layer | One-line rule |
|---|---|---|
| **G** | **Ground** | The agent works from real artifacts, never from vibes |
| **K** | **Knowledge compounds** | Every mistake becomes a written rule |
| **S** | **Spec before code** | Plan until the plan is right; then execution one-shots |
| **T** | **Test & verify** | Give the agent a way to check its own work — the 2–3× multiplier |
| **A** | **Automate the inner loop** | Anything you do 3+ times a day becomes a command or hook |
| **C** | **Context is a budget** | One task, one session; parallelize instead of piling on |
| **K** | **Keep control** | Permissions, review, and spend limits are part of the stack |

Full method with sources: [docs/GK-STACK.md](docs/GK-STACK.md) ·
Tool-agnostic version: [docs/GK-PRINCIPLES.md](docs/GK-PRINCIPLES.md)

## Pick your path

| You want to… | Go to |
|---|---|
| **Adopt it today** (10-minute setup) | [Your first hour](#your-first-hour), then [starter/](starter/) |
| **See it proven before you invest** | [examples/hono/](examples/hono/) — a real Phase 1 run, evidence per box |
| **Have the agent install it for you** | [docs/GK-STACK-PRD.md](docs/GK-STACK-PRD.md) — plan mode → *"Implement Phase 1 only"* |
| **Understand the method first** | [docs/GK-STACK.md](docs/GK-STACK.md) (sourced) · [GK-PRINCIPLES.md](docs/GK-PRINCIPLES.md) (any tool) |
| **Fix a specific pain right now** | [skills-library/](skills-library/README.md) — the pain → driver table |
| **Stop burning your token budget** | [docs/token-efficient-vibe-coding.md](docs/token-efficient-vibe-coding.md) |
| **Roll it out to a team** | [docs/GK-STACK-IMPLEMENTATION.md](docs/GK-STACK-IMPLEMENTATION.md) — model routing, 4-week ladder, loops |
| **Browse all 29 drivers / what's next** | [skills-extra/README.md](skills-extra/README.md) (index by SDLC stage) · [SKILLS-ROADMAP.md](docs/SKILLS-ROADMAP.md) |

## Your first hour

1. **Install the spine** — from your repo root:
   ```bash
   npx gk-stack init          # copies CLAUDE.md template + .claude/ into this repo
   ```
   (or copy `starter/` contents manually). That's the whole spine: a `CLAUDE.md`
   template, `settings.json` (permissions + format hook + `opusplan`), `/ship`,
   `/triage`, and exactly one skill — `gk-reviewer`. Later, when a pain shows up:
   `npx gk-stack list` · `npx gk-stack add <skill>`.
2. **Let the agent fill its own grounding file** — the fill-in prompt is in
   [the implementation guide §2](docs/GK-STACK-IMPLEMENTATION.md). Real versions from
   lockfiles, real commands, conventions traceable to code. No inventions.
3. **Smoke-test the loop:** ask for something trivial. Plan mode → strong model plans →
   approve → mid-tier executes → the hook auto-formats → `/ship` verifies before committing.
4. **Watch `/ship` earn its keep:** break a test on a scratch branch and invoke it.
   It refuses — [here's exactly what that looks like](examples/hono/SHIP-REFUSAL-TRANSCRIPT.md).

## What's inside

```
gk-stack/
├── docs/                                  ── THE OPERATING SYSTEM ──
│   ├── GK-STACK.md                        # the method — 7 layers, every claim sourced
│   ├── GK-PRINCIPLES.md                   # the 7 layers, no tool required
│   ├── GK-STACK-IMPLEMENTATION.md         # hands-on: model routing, rollout, loops & triage
│   ├── GK-STACK-PRD.md                    # executable spec — hand it to the agent
│   ├── SKILLS-ROADMAP.md                  # where the driver library goes next
│   └── token-efficient-vibe-coding.md     # the token-economics primer
│
├── starter/                               ── THE SPINE — copy into any repo ──
│   ├── CLAUDE.md                          # grounding-file template (G + K)
│   └── .claude/
│       ├── settings.json                  # permissions, deny-list, format hook, opusplan
│       ├── commands/ship.md               # /ship — verify, then commit → push → PR
│       ├── commands/triage.md             # /triage — classify noise, draft-PR chores, digest
│       └── skills/gk-reviewer/            # fresh-eyes review, the ONLY always-on skill
│
├── examples/                              ── THE PROOF ──
│   ├── hono/                              # PRD Phase 1 on a real repo: 17/18 boxes, transcripts
│   └── NOTES.md                           # predicted-vs-actual, deviations owned
│
├── skills-library/                        ── THE DRIVERS: curated 8 ──
│   │                                      # gk-init · gk-graph · gk-parallel · gk-fix-bug
│   │                                      # gk-test · gk-perf · gk-doctor · gk-migrate
│   └── README.md                          # "install when you hit this pain" table
│
├── skills-extra/                          ── THE DRIVERS: remaining 21, by SDLC stage ──
│   │                                      # plan → build → design → ship → operate → close
│   └── README.md                          # full index (incl. gk-release, gk-incident)
│
└── LICENSE                                # MIT
```

**Why the starter ships one skill, not 29.** Every installed skill loads its
description into every session's context. A stack whose C-layer is "context is a
budget" doesn't preinstall a library — when a pain shows up (legacy onboarding,
oversized context, a 2,000-file migration), you
[pull the matching driver](skills-library/README.md) in ten seconds.

## The two rules that keep it coherent

- **One review gate.** `gk-reviewer` ships active. Prefer `gk-review`? Swap — never
  run both. Record the choice in CLAUDE.md → Learned Rules. (PRD R15.)
- **One grounding entry point.** CLAUDE.md stays the ≤200-line front door; the `gk/`
  folder `gk-init` generates is the deep index it points to. Conventions live once.

## Method and drivers, one system

The GK-Stack method and the gk-* driver library are developed together. The method
wasn't written around someone else's skills, and the skills weren't bolted onto
someone else's method: the guardrails in the PRD — human gates on every automated
path, security findings report-only, two-strike limits — are the same ones the
drivers obey. Original pack README preserved at
[skills-extra/VIBE-PACK-README.md](skills-extra/VIBE-PACK-README.md).

The method itself is distilled from named sources — Anthropic's published team
playbook, the official Claude Code best-practices docs, Boris Cherny's workflow,
Simon Willison's agentic patterns — full list with links in
[docs/GK-STACK.md](docs/GK-STACK.md#sources-the-grounded-truth). All 11 citation URLs
verified live 2026-07-04.

---

v1.2 · July 2026 · [MIT](LICENSE) · Claude Code is the reference implementation; the
[principles](docs/GK-PRINCIPLES.md) are tool-agnostic. Verify tool specifics at
code.claude.com/docs as versions move.
