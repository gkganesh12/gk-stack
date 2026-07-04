# GK-Stack Starter Kit

Drop-in setup implementing the GK-Stack method (see GK-STACK.md for the full playbook).

## Install (2 minutes)

1. Copy `CLAUDE.md` and the `.claude/` folder into your repo root.
2. Open `CLAUDE.md` and replace every `<<PLACEHOLDER>>`.
3. Open `.claude/settings.json` and swap the example commands (`npm run ...`) for your real ones.
4. Commit all of it. The stack is a team asset — it lives in git.

## What's inside

| File | GK layer | What it does |
|---|---|---|
| `CLAUDE.md` | G + K | Grounding file the agent reads every session. Includes the Learned Rules section — every mistake becomes a rule. |
| `.claude/settings.json` | A + K | Pre-allowed safe commands, denied dangerous ones, auto-format hook after every edit. |
| `.claude/commands/ship.md` | A + T | `/ship` — verifies, then commits, pushes, and opens a PR. Refuses to ship if verification fails. |
| `.claude/commands/triage.md` | A | `/triage` — classifies repo noise (CI, issues, PR comments), fixes chores as draft PRs, one digest. |
| `.claude/skills/gk-reviewer/SKILL.md` | T | Fresh-eyes code review skill. Flags only correctness/requirement gaps — no over-engineering noise. |

That's the whole spine, deliberately. Skills load their descriptions into every
session, so the starter ships exactly one. When a specific pain shows up, pull the
matching driver from `../skills-library/` — the README there maps pain → skill.

## Daily rhythm (the short version)

1. Non-trivial task? **Plan mode first.** Iterate the plan, not the code.
2. Give the agent a way to **verify** (tests, browser, simulator).
3. Agent did something wrong? Fix it AND add one line to **Learned Rules**.
4. Ship with `/ship`. Review as the tech lead, not the typist.
5. One task per session. Parallelize in separate checkouts instead of piling on.

Start with one thing today. Perfect setup not required.
