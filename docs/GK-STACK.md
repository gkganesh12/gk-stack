# GK-STACK
### Ganesh's Stack — the Grounded Knowledge Stack for AI-assisted development

**GK-Stack** is an opinionated method for building software with AI agents. It is not invented from thin air — every layer is distilled from three real sources:

1. **Anthropic's own teams** — their published internal playbook on how Security, Product, Data Infra, and the Claude Code team itself use AI daily
2. **Boris Cherny** — the creator of Claude Code, whose January 2026 workflow thread went viral and was dissected by InfoQ, VentureBeat, and the entire dev community
3. **The community** — Hacker News, r/vibecoding (89K members), r/ClaudeAI, Simon Willison's agentic patterns, and Andrej Karpathy's shift from "vibe coding" to "agentic engineering"

The name spells the method. Seven letters, seven layers:

| | Layer | One-line rule |
|---|---|---|
| **G** | **Ground** | The agent works from real artifacts, never from vibes |
| **K** | **Knowledge compounds** | Every mistake becomes a written rule |
| **S** | **Spec before code** | Plan until the plan is right; then execution one-shots |
| **T** | **Test & verify** | Give the agent a way to check its own work — the 2-3x multiplier |
| **A** | **Automate the inner loop** | Anything you do 3+ times a day becomes a command or hook |
| **C** | **Context is a budget** | One task, one session; parallelize instead of piling on |
| **K** | **Keep control** | Permissions, review, and spend limits are part of the stack |

---

## G — Ground

*"The better the CLAUDE.md files, the better Claude Code performs." — Anthropic Data Infrastructure team*

The agent should never guess what it can be shown. Grounding has three moves:

**1. A grounding file in every repo.** Boris Cherny's team keeps a single `CLAUDE.md` checked into git — currently about 2.5K tokens. Community consensus (repeated across Reddit and the Claude forums) is to keep it **under ~200 lines**: longer files get partially ignored, and the file rides along on every request. It holds the stack, the commands, the conventions, and the learned rules (see next layer). Anthropic's data scientists use these files to navigate massive codebases — new hires get productive by letting the agent read CLAUDE.md instead of asking humans.

**2. Real artifacts over descriptions.** Anthropic's Security Engineering team cut infrastructure debugging from 10–15 minutes to ~5 by pasting **actual stack traces** into the agent instead of describing problems. Their Data Infra team pasted **screenshots of failing Kubernetes dashboards** and got walked to the fix (pod IP exhaustion) without calling a networking specialist. The rule: paste the real error, the real log, the real schema — never your summary of it.

**3. Reference code beats long prompts.** Simon Willison's pattern: when extending a system, don't write a 500-word explanation — point the agent at working example code (he clones reference repos to `/tmp` so the agent can read them without accidentally committing them). Code is unambiguous; prose about code is not.

---

## K — Knowledge compounds

*"Anytime we see Claude do something incorrectly we add it to the CLAUDE.md, so Claude knows not to do it next time." — Boris Cherny*

This is the layer most developers skip, and it's the one that separates a team that gets better every week from one that fights the same fight daily.

**Every mistake becomes a rule.** When the agent does something wrong — wrong pattern, wrong library, skipped a convention — the fix isn't just fixing the code. It's adding one line to CLAUDE.md's `## Learned Rules` section. Boris's team does this constantly; reviewers even tag `@claude` on coworkers' pull requests to fold the learning back automatically via the GitHub Action. As one analyst put it: the codebase becomes a self-correcting organism.

**Skills for expertise, CLAUDE.md for rules.** Anthropic's May 2026 playbook names five extension axes: **CLAUDE.md, Hooks, Skills, Plugins, Managed Agents**. The split that matters for GK-Stack: CLAUDE.md holds short always-on rules; **Skills** hold deep on-demand expertise (your deployment runbook, your API conventions, docs for that one niche library) that loads only when relevant — so it costs nothing when idle. Community builders go further: one AWS serverless author turns his own published blog posts into custom skills, so the agent reviews code against the standards he writes about publicly.

**Team-shared, version-controlled.** All of this lives in git — CLAUDE.md, `.claude/commands/`, `.claude/skills/`, settings. Everyone contributes; changes get reviewed like code. Institutional knowledge stops living in one senior dev's head.

---

## S — Spec before code

*"If my goal is to write a Pull Request, I will use Plan mode, and go back and forth with Claude until I like its plan. From there, I switch into auto-accept edits mode and Claude can usually 1-shot it. A good plan is really important!" — Boris Cherny*

Karpathy coined "vibe coding" in February 2025. By 2026 he declared that era ending, in favor of what he calls **agentic engineering**: you don't write code 99% of the time — you orchestrate agents against detailed specs, with human oversight. The professionals converged on the same finding independently: community write-ups estimate the planning step **catches ~80% of bad approaches before any tokens are wasted on implementation**.

The GK-Stack spec loop:

1. **Enter plan mode** (no edits allowed) for any non-trivial task.
2. **Iterate on the plan**, not the code. Cheap to change a plan; expensive to change 40 files.
3. **Only then execute** — with auto-accept on for well-planned work, supervised for core logic.
4. For features, keep a lightweight spec file (`specs/feature-name.md`): what, why, acceptance criteria. Tools like GitHub's Spec Kit and BMAD formalize this if you want structure; a plain markdown file works too.

Anthropic's Security Engineering team describes their before/after honestly: the old way was "design doc → janky code → refactor → give up on tests." The new way is pseudocode first, then guided test-driven development, checking in periodically.

**And when the architecture turns out wrong? Restart, don't patch.** Community wisdom straight from Boris: tell the agent *"Knowing everything you know now, design a more elegant solution"* — have it write a detailed plan of everything it did, then rebuild clean in a parallel directory. Starting over is cheap now. Sunk-cost patching is not.

---

## T — Test & verify (the multiplier)

*"The most important tip for using Claude Code is: give Claude a way to verify its output. Once you do that, Claude will iterate until the result is great." — Boris Cherny, who says verification 2–3x's the quality of the final result*

Simon Willison, independently, landed on the identical law: *"Coding agents always work best if they have some kind of validation mechanism they can use to test their own work."* His newsletter pipeline gives the agent a local web server plus browser automation, so it can *see* its rendered output and iterate before any human looks.

Verification is the engine that makes every other layer work. Without it, "auto-accept mode" is gambling. With it, the agent becomes its own QA:

- **Tests as the contract.** Write (or generate) the failing test first; the instruction becomes "make this pass" — a binary signal instead of prose interpretation. Anthropic's Inference team generates edge-case unit tests this way and reports ~80% time reduction on that work.
- **A browser/simulator for UI work.** The Claude Code team tests every change to claude.ai/code through a real browser — open it, click through, iterate until the UX feels right.
- **Fresh eyes for review.** Anthropic's official best practices: use a **Writer/Reviewer pattern** — a second session (or subagent) with clean context reviews the work, because a fresh context isn't biased toward code it just wrote. One caution from the same doc: tell the reviewer to flag only gaps affecting correctness or stated requirements, or it will invent findings and drive over-engineering.
- **Verification before shipping is non-negotiable.** The GK-Stack ship command (in the starter kit) refuses to commit until the verify step passes.

---

## A — Automate the inner loop

*Boris invokes his `/commit-push-pr` slash command dozens of times daily.*

Anything you find yourself doing three or more times a day is a candidate for codification. The tools of this layer, all checked into git so the whole team gets them:

**Slash commands** (`.claude/commands/*.md`) for repeated workflows — commit-push-PR, "simplify this code," "verify the app." Boris's trick: use inline bash inside the command to **pre-compute context** (git status, current diff, branch name) so the agent doesn't burn a round-trip discovering it.

**Hooks** for deterministic guarantees. Boris runs a `PostToolUse` hook that auto-formats after every file edit (`format || true`) — the agent writes mostly-clean code, the hook handles the last 10% so CI never fails on formatting. Hooks are for mechanical problems; don't orchestrate workflow with them.

**Scheduled and event-driven agents** for the outer loop. Anthropic teams automate PR review comments through GitHub Actions with the agent fixing formatting and refactoring test cases automatically. Community patterns from HN: "every Monday, audit dependencies and open PRs," "when an issue is labeled `bug`, investigate and open a draft PR." Boris uses `/loop` to babysit his PRs — auto-fixing build issues as comments come in.

**Batch for bulk.** For migrations across thousands of files, the official pattern is a shell loop dispatching one headless agent per file (`claude -p "Migrate $file..."`) with scoped permissions — an assembly line, not one heroic session.

---

## C — Context is a budget

*The official Claude Code docs name the #1 anti-pattern: the "kitchen sink session" — one task, then an unrelated question, then back again, until the context is mud.*

**One task, one session.** Finish, `/clear`, next. A context full of dead exploration taxes every subsequent turn in both quality and tokens.

**Parallelize instead of piling on.** Boris runs **5 terminal sessions in parallel** — each in its **own git checkout** so they can't conflict — tabs numbered 1–5, OS notifications when one needs input, plus 5–10 more sessions in the browser, some started from his phone in the morning. He treats agent capacity like compute to schedule, not a chat to sit inside. (He also abandons 10–20% of sessions that go sideways — abandoning is a feature, not a failure.)

**Route models by stakes — with eyes open.** Here the sources honestly disagree, and GK-Stack tells you both:

- **Boris's position:** use the strongest model with thinking *for everything* — "you have to steer it less... it is almost always faster than using a smaller model in the end." He's optimizing the *correction tax*: human time fixing mistakes costs more than compute.
- **The community's position:** route cheap models to routine automations and reserve the frontier model for architecture and planning — teams report 70%+ cost cuts with quality held where it matters.

**The GK-Stack stance:** both are right at different stakes. Plan and architect on the strongest model (small token volume, highest leverage). Execute well-specified work on the mid-tier — *layers S and T are exactly what make this safe*, because a good spec plus self-verification substitutes for raw model strength on routine execution. Escalate instantly on failure instead of letting a cheaper model loop. If you're on a flat-rate subscription rather than the API, Boris's "strongest model always" is simply correct — the correction tax is the only tax you pay.

---

## K — Keep control

*Boris almost never uses `--dangerously-skip-permissions`. He pre-allows known-safe commands via `/permissions` — shared with the team, versioned in git.*

The layer that keeps velocity from becoming an incident report:

**Permissions as a team asset.** Pre-allow the safe commands (`test:*`, `build:*`, `git status`...) so the right thing is the default and the agent isn't nagging you into blanket-approving everything. Deny the dangerous ones outright — community security write-ups specifically deny `git commit --no-verify` after a real hook-bypass was found in the wild. Full autonomy only inside a sandbox.

**A human review checkpoint, always.** The HN "compounding engineering" pattern (user *turnsout*): everything is agent-written, but commits are reviewed before push — and every review finding is **fed back into the tooling** (CLAUDE.md rules, hooks, skills) so the same issue never needs reviewing twice. You are the tech lead now, not the typist: the community's daily rhythm is morning PR review → queue specs → agents work → evening review.

**Guard the supply chain and the spend.** Secrets scanning (gitleaks) and pre-commit hooks; a "no new dependencies without asking" rule in CLAUDE.md; session budgets and an audit trail of agent actions so that when something goes wrong, you can see exactly what happened.

---

## Adopting GK-Stack — the four-week ladder

Anthropic's own playbook stresses this to its readers: even Anthropic employees didn't do everything from day one. **Start with one thing today rather than aiming for a perfect setup.**

- **Week 1 — G:** Drop the starter `CLAUDE.md` in your repo. Fill in stack, commands, conventions. Start pasting real errors instead of describing them.
- **Week 2 — S + T:** Plan mode for everything non-trivial. Give the agent one verification loop (your test command, or a browser).
- **Week 3 — K + A:** Start the Learned Rules section — every mistake becomes a rule. Create your first slash command for whatever you did most this week. Add the format hook.
- **Week 4 — C + K:** Try two parallel sessions in separate checkouts. Set up `/permissions` allow/deny lists. Add the review skill.

After a month you're not "using AI" — you're running a system that gets smarter every week.

---

## The starter kit

GK-Stack ships as files, not just advice. The `starter/` folder in this repo is the drop-in spine:

```
starter/
├── README.md                          # install + customize guide
├── CLAUDE.md                          # grounding file template (G + K)
└── .claude/
    ├── settings.json                  # permissions + format hook (A + K)
    ├── commands/
    │   ├── ship.md                    # /ship — verify → commit → push → PR (A + T)
    │   └── triage.md                  # /triage — classify repo noise, digest for humans (A)
    └── skills/
        └── gk-reviewer/
            └── SKILL.md               # fresh-eyes review skill (T)
```

Copy it into a repo, fill in the placeholders, and you're running the stack in ten minutes. When a specific pain shows up — legacy onboarding, oversized context, parallel work — pull the matching driver from `skills-library/`.

---

## Sources (the grounded truth)

- **How Anthropic teams use Claude Code** — official: claude.com/blog/how-anthropic-teams-use-claude-code
- **Claude Code best practices** — official docs: code.claude.com/docs/en/best-practices
- **Boris Cherny's workflow thread** (Jan 2, 2026) and coverage: infoq.com/news/2026/01/claude-code-creator-workflow · howborisusesclaudecode.com · paddo.dev/blog/how-boris-uses-claude-code · venturebeat.com (creator-workflow analysis)
- **Simon Willison's agentic patterns** — validation mechanisms & reference-code prompting (documented across his blog and aiforautomation.io's April 2026 analysis)
- **Karpathy: vibe coding → agentic engineering** — via Towards Data Science, "From Vibe Coding to Spec-Driven Development" (May 2026)
- **Community consensus** — r/vibecoding, r/ClaudeAI, Hacker News threads; secure-vibe-coding research (Medium, June 2026); "workflows that actually ship" (DEV, March 2026)

*GK-Stack v1.1 — compiled July 2026. Re-verify tool specifics against code.claude.com/docs as features evolve.*
