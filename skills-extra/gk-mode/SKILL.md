---
name: gk-mode
description: >-
  Sets and persists the execution mode (manual or autonomous) for the
  entire gk-* framework by writing GK_MODE to CLAUDE.md, which all
  gk-* skills read on startup. Use whenever the user wants to control
  how much the framework runs automatically vs waits for human input.
  Triggers on "gk-mode: autonomous", "gk-mode: manual",
  "gk-mode: status", "set autonomous mode", "set manual mode",
  "switch to autonomous", "turn on autonomous", "turn off autonomous",
  "what mode am I in".
---

# GK Mode Skill

Sets and persists the execution mode for the entire gk-* framework.
One command. Affects every skill in the session.

---

## Commands

```
gk-mode: autonomous    ← full auto-execution, subagents, auto-review
gk-mode: manual        ← default, waits for next and review: at each step
gk-mode: status        ← shows current mode and what it means
```

---

## Step 1 — Read current CLAUDE.md

```bash
cat CLAUDE.md 2>/dev/null | grep "GK_MODE" || echo "NOT SET"
```

If `CLAUDE.md` does not exist:
> "No CLAUDE.md found — are you at the project root?
> Run this from inside a gk-* project."
Stop.

---

## Step 2 — Apply the mode

### Setting autonomous mode

Find the `## Execution mode` section in `CLAUDE.md`.
If it exists — update the `GK_MODE` line.
If it doesn't exist — append the section.

```
## Execution mode
GK_MODE=autonomous
```

Then confirm:

```
⚡ Autonomous mode activated.

What this means for this session:
  Tasks      — execute automatically, no "next" needed
  Parallel   — independent tasks spawn as subagents simultaneously
  Sequential — dependent tasks run in order automatically
  Review     — runs automatically after each phase completes
  P0 found   — stops and waits for you to resolve
  P1/P2      — logged to backlog, build continues
  Deploy     — always manual, no exceptions

To switch back: gk-mode: manual
```

### Setting manual mode

```
## Execution mode
GK_MODE=manual
```

Confirm:

```
✋ Manual mode activated.

What this means for this session:
  Tasks    — say "next" after each task
  Parallel — asked once per session (y/n)
  Review   — run "review: phase N" manually after each phase
  Deploy   — manual

This is the default gk-* behaviour.
To switch: gk-mode: autonomous
```

### Status check

Read current `GK_MODE` from `CLAUDE.md`. Show:

```
Current mode: [autonomous | manual | not set (defaults to manual)]

[Show the relevant "what this means" block from above]

Switch with:
  gk-mode: autonomous
  gk-mode: manual
```

---

## How all gk-* skills read the mode

Every skill that executes tasks reads this at startup:

```bash
grep "GK_MODE" CLAUDE.md 2>/dev/null | cut -d= -f2 | tr -d ' '
```

Returns `autonomous`, `manual`, or empty (treated as `manual`).

The mode check happens once per skill invocation — at the very start,
before any planning or execution. If the mode changes mid-session
(user runs `gk-mode:` again), the next skill invocation picks it up.

---

## Absolute rules

**Deploy is always manual.** `GK_MODE=autonomous` never removes the
deploy gate. Shipping to production always requires a human to confirm.

**P0s always stop autonomous mode.** The autonomous loop pauses on any
P0 finding from review. The build does not continue until P0s are resolved.
This is non-negotiable — P0s exist precisely because they block progression.

**The mode persists until explicitly changed.** Setting `autonomous` at the
start of a `new:` session means it stays autonomous for every subsequent
`add-feature:`, `fix-bug:`, and `review:` in that project until you run
`gk-mode: manual`.

**Manual mode is always safe to switch to.** At any point during an
autonomous run, `gk-mode: manual` puts the brakes on. The current
task completes (subagents already running finish), then the session
waits for human input before proceeding.
