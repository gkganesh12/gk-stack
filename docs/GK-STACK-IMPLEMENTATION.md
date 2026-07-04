# Implementing GK-Stack
### The hands-on guide — with Sonnet/Opus routing at every step

This is the "how" companion to the GK-Stack playbook. Follow it top to bottom and you'll go from zero to a running GK-Stack setup in one sitting, then harden it over four weeks. Every step names **which model to use and why**.

Tool specifics verified against the official Claude Code docs (code.claude.com/docs), July 2026.

---

## 0. The one-line implementation

If you remember nothing else from this guide:

```
/model opusplan
```

`opusplan` is a built-in Claude Code alias that **is** the GK-Stack model philosophy as a native feature: **Opus does the thinking in plan mode, and the moment you approve the plan and execution begins, it automatically switches to Sonnet** to write the code. Opus-quality architecture, Sonnet-priced implementation, zero manual switching. This matters because most tokens in a session are burned during execution (generating files, iterative edits) — exactly the phase Sonnet handles well when the plan is good.

Everything else in this guide is building the system around that spine.

---

## 1. The GK-Stack model routing map

Aliases resolve to the current recommended version — on the Anthropic API today, `opus` = Opus 4.8 and `sonnet` = Sonnet 5. Use aliases, not pinned version names, so your setup improves automatically over time.

| Task | Model | Why |
|---|---|---|
| Planning, architecture, specs (layer **S**) | **Opus** (via `opusplan` plan mode) | Highest-leverage tokens you'll spend. A good plan makes everything downstream cheaper. |
| Executing a well-specified plan | **Sonnet** (automatic under `opusplan`) | With a clear spec + verification loop (layers S + T), Sonnet implements reliably at a fraction of the cost. |
| Everyday tasks, small fixes, tests, docs | **Sonnet** | Your home base. Start here; escalate only when it actually struggles. |
| Codebase exploration, renames, boilerplate, formatting-level grunt work | **Haiku** | Claude Code's own internal Explore agent runs on Haiku — follow its lead for mechanical work. |
| Gnarly multi-file debugging, subtle bugs, "Sonnet is looping" | **Opus** (escalate: `/model opus`) | This is the correction-tax territory where the strongest model is genuinely faster overall. |
| Mid-execution second opinion without full switch | **`/advisor`** | Keeps Opus on call while Sonnet executes; Anthropic measured ~12% cost reduction with slightly *better* accuracy using this pattern. |
| Critical-path code review (layer **T**) | **Opus**, fresh session | Fresh context + strongest judgment for the code that matters most. Routine PRs: Sonnet reviewer is fine. |

**How to switch, everywhere it's possible:**

```bash
/model                      # in-session picker (Enter = save as default, s = this session only)
/model sonnet               # or: opus, haiku, opusplan
claude --model opusplan     # set at launch
```

Or lock the default for the whole team in the starter kit's `.claude/settings.json`:

```json
{ "model": "opusplan" }
```

**Plan-access notes:** `opusplan` requires Opus access on your plan — where Opus isn't available, it gracefully stays on Sonnet in plan mode, so it's safe to set team-wide. If you're on a subscription (Pro/Max) rather than API billing, routing still matters: Sonnet consumes far less of your usage quota, so `opusplan` stretches your session limits the same way it stretches API dollars. Check your plan's current model access at support.claude.com — it changes over time.

---

## 2. Day 0 — install and wire up (~30 minutes)

**Step 1 — Install or update Claude Code.**

```bash
npm install -g @anthropic-ai/claude-code   # first install
claude update                              # or update an existing install
claude --version                           # Sonnet 5 needs v2.1.197+, Opus 4.8 needs v2.1.154+
```

Then run `claude` in any folder and complete login. (Other install methods: code.claude.com/docs.)

**Step 2 — Drop in the starter kit.** Copy the contents of this repo's `starter/` folder into your repo root so you have `CLAUDE.md` and `.claude/` at the top level.

**Step 3 — Let the agent fill its own grounding file.** *Model: Sonnet — this is exploration + summarization, not architecture.* From the repo root, run `claude` and paste:

```
Read this codebase. Then open CLAUDE.md and replace every <<PLACEHOLDER>> with
the real values: stack + exact versions from the lockfile, the actual dev/test/
build commands from package.json (or equivalent), and 3-5 conventions you can
infer from the existing code. Keep the file under 200 lines. Do not invent
conventions we don't follow — if unsure, leave a TODO comment. Do not touch the
Learned Rules section.
```

Tip: if the repo already had a `CLAUDE.md` from `/init`, tell the agent to merge it into the GK template rather than duplicate.

**Step 4 — Adapt settings to your toolchain.** Open `.claude/settings.json`: swap the `npm run ...` entries in permissions and the format hook for your real commands (pnpm/bun/make/pytest — whatever you use). Add `"model": "opusplan"`.

**Step 5 — Smoke-test the loop.** Ask for something trivial ("add a --version flag"), watch it: enter plan mode (Shift+Tab) → Opus plans → approve → Sonnet executes → hook auto-formats → run `/ship` → it verifies before committing. If all five happen, the spine works.

**Step 6 — Commit everything.** `CLAUDE.md`, `.claude/` — all of it goes in git. The stack is a team asset from day one.

---

## 3. Implementing the layers — the four-week rollout

### Week 1 — G: Ground *(model: Sonnet for everything this week)*

Your only job: stop describing, start showing. Concrete habits to install:

1. Error occurs → paste the **full stack trace**, not a summary. Failing CI → paste the log section.
2. The agent needs to match an existing pattern → point it at the file: *"Follow the structure of src/api/users.ts"* — reference code beats prose.
3. Using a niche or post-cutoff library → paste the relevant README section once, and note in CLAUDE.md where the docs live.
4. End of week: read CLAUDE.md out loud. Delete anything stale. Under 200 lines, always.

### Week 2 — S + T: Spec before code, then verify *(model: `opusplan` — this is its home turf)*

The core loop you'll run for every non-trivial task from now on:

1. **Shift+Tab into plan mode.** Opus is now driving. State the task and paste the prompt below (Prompt Library, P1).
2. **Iterate on the plan, not the code.** Push Opus for specificity: numbered steps, files to touch, edge cases, what "done" means. Cheap to fix here, expensive later.
3. **Approve → Sonnet executes.** For well-planned work, auto-accept mode is safe *because* verification is coming. For core business logic, stay supervised.
4. **Verification is the gate.** Fill CLAUDE.md's Verification section with a real command this week. For UI work, give the agent a browser or the dev server URL and tell it to check its own output. If a task has no verification path, that's the first thing to fix.
5. TDD variant for logic-heavy work: have the agent write the failing test first (Sonnet), confirm the test is right, then "make it pass."

### Week 3 — K + A: Knowledge compounds, loops get automated *(Sonnet, with one Opus exception)*

1. **Start the Learned Rules ritual.** Every time the agent does something wrong: fix it, then run Prompt P3. One line added to CLAUDE.md. This is the single highest-ROI habit in the stack — mistakes stop repeating.
2. **Use `/ship` for real.** It runs verification and refuses to commit on failure — let it. Don't bypass.
3. **Confirm the format hook fires** after edits (you'll see it in the transcript). Mechanical guarantee, zero attention needed.
4. **Write your second slash command** for whatever you did most this week (a `/simplify`, a `/test-this`, a deploy checklist). Copy `ship.md`'s structure: pre-computed context via inline bash, then numbered instructions.
5. *(Opus exception)* If a recurring chunk of expertise emerges — your deployment runbook, your API conventions — have **Opus** draft it as a skill in `.claude/skills/<name>/SKILL.md` (Prompt P4). Distilling expertise is architecture work.

### Week 4 — C + K: Context discipline, keep control *(Sonnet default; Opus for the review skill on critical code)*

1. **One task, one session.** Finish → `/clear`. Long session you must continue → `/compact`. Watch quality jump.
2. **Try two parallel sessions**, each in its own checkout so they can't collide:
   ```bash
   git clone <repo-url> ../myrepo-2      # or: git worktree add ../myrepo-2 -b task-2
   # terminal tab 1: cd myrepo   && claude
   # terminal tab 2: cd myrepo-2 && claude
   ```
   Number the tabs. Turn on terminal notifications. You're scheduling capacity now, not babysitting a chat.
3. **Tighten `/permissions`.** Add safe commands you approved repeatedly this month to the allow list; confirm the deny list blocks `--no-verify` and force-push. Review the lists as a team — they're versioned policy.
4. **Reviews:** run the `gk-reviewer` skill in a **fresh session** on your next meaningful PR. Sonnet for routine, `/model opus` first for critical-path code.
5. **Watch the spend** for one week (`/cost` on API billing, or your plan's usage view). If execution is eating budget, you're under-using `opusplan`/Haiku; if correction loops are eating it, you're under-planning — fix with more Opus up front, not less.
6. **Start your first loop — read-only.** Schedule the morning triage digest (P6) on Haiku or Sonnet. Let it prove its judgment for a week before it climbs the trust ladder (§5).

---

## 4. The daily rhythm (print this)

1. Skim overnight loop output first — the triage digest and babysat PRs. Approve, reject, or queue; don't start implementing at breakfast.
2. Pick ONE task. Fresh session (`/clear`), `opusplan` active.
3. Non-trivial? **Shift+Tab** → plan with Opus (P1) → iterate → approve.
4. Sonnet executes. You review the diff, not the keystrokes.
5. Sonnet stalls mid-task? `/advisor` or one targeted `/model opus` consult, then back.
6. Verify (the agent runs it — you confirm it happened).
7. `/ship`. Read the PR as the tech lead.
8. Anything went wrong today? → one Learned Rule (P3). Did something 3+ times? → tomorrow it's a slash command. Triaged the same kind of item twice this week? → it becomes a loop (P5/P6).

---

## 5. Loops & triage — automation that runs while you sleep

Layer A, scaled: instead of you invoking a command, the agent runs on a schedule or reacts to events. This is where GK-Stack's biggest wins live — and its biggest budget risks, so the efficiency rules below are load-bearing.

**The three loop types:**

| Type | Mechanism | Real-world example |
|---|---|---|
| Recurring session loop | `/loop` — reruns your prompt on an interval, up to 3 days unattended | Boris's daily driver: *"/loop babysit all my PRs. Auto-fix build issues and when comments come in, use a worktree agent to fix them"* |
| Scheduled / event-driven | Sessions triggered by schedule or repo events | "Every Monday 9 AM: audit dependencies, open PRs for outdated packages" · "Issue labeled `bug` → create branch, investigate, open a **draft** PR" |
| Headless batch loop | Shell loop dispatching `claude -p` per item with scoped tools | Migrating 2,000 files: an assembly line of small fresh contexts, not one heroic session |

**The triage pattern** — what your loops should mostly do. Gather the noise, classify it, act only on the safe tier, hand the rest to a human as one digest:

1. **Gather:** failing CI runs, new issues, PR review comments, flaky tests since the last run.
2. **Classify:** P0 broken-for-users · P1 real bug · P2 chore (lint, deps, formatting, stale docs) · noise.
3. **Act on P2 only:** fix each in an isolated worktree, open a *draft* PR per fix.
4. **Report P0/P1:** reproduction steps, suspected cause, the relevant trace — a decision-ready brief, not a fix attempt.
5. **Digest:** one message, ordered by severity, with links. Two minutes to read over coffee.

**The efficiency rules (non-negotiable for unattended work):**

1. **Loops run on Sonnet or Haiku — never a frontier model unattended.** A headless loop left on Opus can drain a budget in a single run. Digest/classification loops → Haiku; fixing loops → Sonnet. Escalating any item to Opus is a *human* decision made from the digest, not the loop's.
2. **Climb the trust ladder.** Every loop starts read-only (report only) → graduates to auto-fixing formatting/lint → then failing tests. **Never auto-fix security findings** — those are always report-only.
3. **Every loop ends at a human gate.** Draft PRs, digests, comments. A loop never merges, deploys, deletes, or pushes to main.
4. **Two strikes for robots.** Unattended, the three-failure rule tightens: the loop stops and flags an item after two failed attempts — it never retries until the budget dies.
5. **Scope per loop.** Its own worktree (so parallel loops can't collide), a minimal permission set, and a prompt that names exactly which labels, paths, and repos it may touch.
6. **Bulk + non-urgent → Batch API.** Overnight doc generation, mass annotation, backfills: 50% off, and it stacks with caching.

The `/triage` on-demand command and the two starter loops (P5, P6 in the prompt library) are specced as requirements in GK-STACK-PRD.md — have Claude Code implement them from there rather than hand-rolling.

---

## 6. The escalation ladder (when Sonnet struggles)

Work the ladder in order — each rung is cheaper than the next:

1. **Re-ground, same model.** 80% of "the model is dumb" is missing context: paste the real error, the real file, the reference implementation.
2. **Fresh context, same model.** `/clear` and restate the task cleanly with the plan. Context rot masquerades as model weakness.
3. **`/advisor`** — Opus consults on the sticking point; Sonnet keeps executing.
4. **`/model opus`** with the failure evidence: what was tried, what broke, actual output. Three failed attempts by Sonnet is the trigger — never let any model loop past three.
5. **The restart** (Opus): run Prompt P2 — write up everything learned, design the elegant solution, rebuild in a parallel directory. Starting over is cheap; sunk-cost patching is not.
6. **Fable-class escalation** — only if Opus has demonstrably failed *and* the task justifies 2x Opus pricing. In GK-Stack this is rare by design: layers S and T exist so raw model strength is needed less often.

---

## 7. Prompt library (copy-paste)

**P1 — The planning prompt (Opus, plan mode)**
```
Before any code: produce an implementation plan for the task below.
Include: (1) files to create/modify, (2) numbered steps in order,
(3) edge cases and failure modes, (4) what could go wrong with this approach,
(5) the exact verification that proves it works (per CLAUDE.md).
Ask me up to 3 clarifying questions first if anything is ambiguous.
Task: <describe the task>
```

**P2 — The restart prompt (Opus)**
```
Stop. Knowing everything you know now about this codebase and this task,
write a short postmortem: what we built, what turned out to be wrong about
the approach, and what you'd do differently. Then design the more elegant
solution as a fresh plan. We will rebuild in a parallel directory.
```

**P3 — The learned-rule prompt (Sonnet)**
```
You just made this mistake: <one sentence>. Add a single terse line to the
"Learned Rules" section of CLAUDE.md so it never happens again.
Rule format: what to do / not do + the one-word reason. No prose.
```

**P4 — The skill-distiller prompt (Opus)**
```
We keep re-explaining <topic, e.g. our deployment process>. Create
.claude/skills/<name>/SKILL.md capturing it: YAML frontmatter (name +
a description that says exactly WHEN to use it), then the procedure,
our conventions, one worked example, and the pitfalls. Terse. It loads
on demand, so completeness beats brevity here — but no filler.
```

**P5 — The PR babysitter loop (Sonnet)**
```
/loop Watch my open PRs. When CI fails: diagnose from the actual logs.
If the fix is formatting/lint/type-level, fix it in that PR's worktree
and push to the PR branch. When review comments arrive: address them in
the worktree and push. Stop and flag any PR after 2 failed attempts.
Never touch main, never merge, never act on security findings — report
those in the digest only.
```

**P6 — The morning triage digest loop (Haiku or Sonnet)**
```
/loop Every morning: gather failing CI runs, new issues, and unanswered
PR comments since the last run. Classify each as P0 user-breaking /
P1 bug / P2 chore / noise. For P2 chores only: fix in isolated worktrees
and open draft PRs. For P0/P1: write a decision-ready brief (repro,
suspected cause, link) — do not attempt fixes. Output one digest ordered
by severity. You may not merge, deploy, delete, or push to main.
```

---

## 8. What "implemented" looks like

You know GK-Stack is running when: every non-trivial task starts in plan mode and one-shots more often than not · CLAUDE.md's Learned Rules grows weekly and old mistakes stopped recurring · `/ship` has blocked at least one bad commit · your Opus spend concentrates in planning/debugging while Sonnet does the volume · and reviewing agent PRs feels like tech-leading, not typing.

*Companion files: GK-STACK.md (the why) · starter/ (the files) · GK-STACK-PRD.md (hand it to Claude Code and it implements all of this). Verify tool behavior at code.claude.com/docs as versions move.*
