# Token-Efficient Vibe Coding
### A developer's guide to shipping with AI without burning your budget

Vibe coding is fun until the invoice arrives. The difference between a developer who spends $30/month and one who spends $500/month on AI coding is rarely output — it's habits. Both ship features. One of them re-sends a 200K-token context forty times a day to a flagship model to rename a variable.

This guide covers the habits that matter, in order of impact: model routing, grounding the model in truth, stack choice, reusable skills, context discipline, and the pricing levers most developers never touch.

Pricing below is per million tokens (input/output), current as of July 2026. Always verify at [claude.com/pricing](https://claude.com/pricing) — rates and lineups change.

---

## 1. Route models like you route traffic

The single biggest lever. The Claude lineup spans a 10x price range, and the expensive end is not 10x better at most tasks — it's better at a narrow class of hard tasks.

| Model | Input / Output ($/MTok) | Use it for |
|---|---|---|
| **Haiku 4.5** | $1 / $5 | Boilerplate, renames, docstrings, commit messages, log parsing, simple CRUD, test scaffolding |
| **Sonnet 5** | $2 / $10 (intro until Aug 31, 2026, then $3 / $15) | Your default. Everyday features, refactors, code review, most debugging |
| **Sonnet 4.6** | $3 / $15 | Same tier as Sonnet 5 — use if you're pinned to its behavior |
| **Opus 4.8** | $5 / $25 | Gnarly multi-file debugging, large migrations, long autonomous agent runs where a wrong turn is expensive |
| **Fable 5** | $10 / $50 | Reserve for tasks where Opus demonstrably fails. Escalation tier, not a daily driver |

**The rule:** default to Sonnet, drop to Haiku for grunt work, escalate to Opus/Fable only when the cheaper model has actually failed — not when you *imagine* it might.

**Why this matters in real money:** a typical agentic bug fix (~25 tool calls, 400K cumulative input with caching, 10K output) costs roughly **$0.54 on Sonnet 4.6, $0.90 on Opus 4.8, and $1.80 on Fable 5**. Same fix. Run 20 of those a day and the annual difference between "Sonnet by default" and "Fable by default" is thousands of dollars.

**The plan-then-execute pattern:** when a task genuinely needs frontier reasoning, use the expensive model for the *thinking*, not the *typing*:

1. Ask Opus/Fable to produce a detailed implementation plan (small input, small output — cheap even at flagship rates).
2. Hand that plan to Sonnet or Haiku to execute file by file.
3. Escalate back up only if execution hits a wall.

You pay flagship prices for a 2K-token plan instead of a 300K-token coding session.

**One trap to know:** Fable 5, Opus 4.7+, and Sonnet 5 use a newer tokenizer that produces roughly 30% more tokens for the same text. The per-token rate looks the same on paper, but the same prompt bills for more tokens. Re-estimate costs when you migrate models instead of reusing old math.

---

## 2. Ground the model in truth — hallucinations are a token tax

Every hallucinated API call costs you three times: the tokens to generate the wrong code, the tokens to see it fail, and the tokens to fix it. "Grounded truth" isn't a philosophy — it's the cheapest debugging strategy that exists.

**Feed real artifacts, never descriptions of artifacts:**

- Paste the **actual error message and stack trace**, not "it's throwing some error."
- Paste the **actual file contents** (or let the agent read the file), not your memory of what's in it.
- Paste the **actual API response**, schema, or type definition the code must satisfy.

A model guessing at your function signatures will confidently invent plausible ones. A model looking at the real file cannot.

**Pin your versions and say them out loud.** "Write this with React" invites the model to mix hooks-era and legacy patterns. "React 19, Next.js 15 App Router, TypeScript strict" collapses the guess space. Put versions in your project context file (next section) so you never repeat them.

**For unfamiliar or fast-moving libraries, supply the docs.** If you're using a package released after the model's training data — or an obscure one — paste the relevant README section or link the docs and have the agent fetch them. Thirty seconds of pasting beats five retry loops of invented method names.

**Make tests the ground truth.** The tightest feedback loop is: write (or generate) a failing test first, then ask the model to make it pass. The test is unambiguous, machine-checkable truth. "Make the test pass" converges in far fewer iterations than "make it work," because the model gets a binary signal instead of your prose interpretation of correctness.

---

## 3. Pick boring stacks — the model's training data is your free documentation

Model competence is not uniform across the ecosystem. It's proportional to how much public code exists for a stack. Choose accordingly and you get fewer hallucinations, fewer retry loops, and fewer tokens spent correcting invented APIs — for free.

**Deep-knowledge stacks (models rarely hallucinate these):**

- **Web:** Next.js/React, plain Node/Express, Django, FastAPI, Rails, Laravel
- **Styling:** Tailwind CSS, plain CSS
- **Data:** PostgreSQL, SQLite, Redis, Prisma/SQLAlchemy/Drizzle
- **Languages:** TypeScript, Python, Go — enormous public corpus, strong idiom knowledge

**Where token burn spikes:**

- Niche frameworks with small communities (the model will pattern-match from a more popular lookalike and get details wrong)
- Packages released in the last few months (post-training-cutoff — supply docs or expect inventions)
- Heavy in-house abstractions the model has never seen (document them in your context file, or every session re-learns them the expensive way)

This isn't "never use new tools." It's: **know that an exotic choice shifts documentation duty onto you.** If you go niche, budget the tokens to feed the model real docs — don't pay the same cost repeatedly in failed generations.

Fewer dependencies also means less context. Every package the model must reason about is more surface area for confusion. A `cp`-able utility function is often cheaper, in tokens and in maintenance, than a dependency the model half-knows.

---

## 4. Write it once: CLAUDE.md and Skills

If you find yourself typing the same instructions twice, you're paying twice. Persistent context is how you stop.

**CLAUDE.md — your project's standing orders.** Claude Code automatically loads a `CLAUDE.md` file from your repo root into every session. This is where grounded truth lives permanently:

```markdown
# CLAUDE.md

## Stack
- Next.js 15 (App Router), TypeScript strict, Tailwind v4
- PostgreSQL 16 via Drizzle ORM — schema in /src/db/schema.ts
- Auth: better-auth. Never hand-roll session logic.

## Commands
- Dev: pnpm dev | Test: pnpm test | Typecheck: pnpm typecheck

## Conventions
- Server components by default; add "use client" only when needed
- All DB access through /src/db/queries — no inline SQL in routes
- Run pnpm typecheck after edits; fix errors before finishing

## Don't
- Don't add new dependencies without asking
- Don't rewrite whole files — make targeted edits
```

Keep it under a few hundred lines. It's loaded into *every* request, so a bloated CLAUDE.md is itself a token leak. Terse, high-signal, current.

**Skills — expertise loaded on demand.** Skills are folders containing a `SKILL.md` (instructions, conventions, examples, even scripts) that the agent loads *only when relevant*. That's the efficiency trick: unlike CLAUDE.md, a skill costs almost nothing until the task actually needs it.

Good skill candidates:

- **Your deployment runbook** — the exact steps, flags, and gotchas, so the model never improvises against prod
- **Your API conventions** — error format, pagination style, auth middleware pattern, with one canonical example endpoint
- **A niche library you use heavily** — condensed real docs, so you pay the documentation cost once instead of per-session
- **Team code review checklist** — what "done" means in your shop

The pattern: **any knowledge you'd otherwise re-explain across sessions belongs in a skill.** Write once, reference forever, pay near-zero when idle.

---

## 5. Context discipline — the silent budget killer

Every message in a conversation re-sends the entire history as input tokens. A long, meandering session doesn't cost linear tokens — it compounds.

**One task, one session.** Finish the feature, start fresh for the next. In Claude Code, `/clear` resets context between unrelated tasks; `/compact` summarizes a long session into a short one when you must continue. A context window full of dead exploration from two hours ago is pure input-token overhead on every subsequent turn.

**Scope the context, don't dump the repo.** Point the agent at the two or three relevant files. Agents can search and read files themselves — let them pull what they need instead of pre-loading 50 files "just in case." Every irrelevant file in context is money spent making the model's job *harder*.

**Ask for diffs, not rewrites.** "Change the validation in `createUser` to reject disposable emails" produces a 30-line targeted edit. "Here's my file, fix it and send the whole thing back" produces 400 lines of output — and output tokens cost **5x** input tokens on every Claude tier. Full-file regeneration is the most expensive way to change ten lines that has ever been invented.

**Kill runaway loops early.** If an agent has tried the same failing approach three times, stop it. Re-ground it (real error, real file, smaller ask) or escalate one model tier with a *fresh, tight* context. Ten more iterations of a confused agent on a cheap model costs more than one clean attempt on a better one — this is the legitimate use case for Opus/Fable.

---

## 6. The pricing levers most developers never touch

**Prompt caching — 90% off repeated input.** Cache reads cost 10% of the base input rate on every Claude model. Claude Code enables this automatically. If you build against the API directly: put stable content (system prompt, CLAUDE.md, reference docs) at the *start* of the prompt, variable content at the end, and mark cache breakpoints. For agentic coding, where the same project context rides along on every one of 25+ calls per task, caching is routinely the difference between a $1.35 task and a $0.54 task.

**Batch API — flat 50% off.** Anything asynchronous — nightly test-suite triage, bulk doc generation, backfilling docstrings across a repo, large-scale code annotation — goes through batch at half price, typically processed within 24 hours. It stacks with caching.

**Cap the output side.** Output tokens are 5x input, and *thinking tokens bill as output*. Set `max_tokens` sanely, use effort controls where available (Opus 4.8 exposes low/high/xhigh/max — default is high; drop to low for routine work), and don't request extended thinking for tasks that don't need it. Asking for "concise" answers is literal money.

**Subscription vs API.** If your usage is interactive coding assistance, a flat Pro/Max plan often beats pay-as-you-go API billing — Anthropic's own figures put typical Claude Code usage around $13/developer per active day, with 90% of users under $30/day. The API is for programmatic pipelines, CI integration, and products. Price both before defaulting.

---

## 7. Anti-patterns → fixes

| Wasteful habit | What it costs | Do instead |
|---|---|---|
| Flagship model for everything | 2–10x per task, every task | Sonnet default, route up/down (§1) |
| "It doesn't work, fix it" | Retry loops on guesses | Paste the real error + real file (§2) |
| Vibing on an obscure framework with no docs supplied | Hallucinated APIs, fix loops | Boring stack, or supply docs once via a skill (§3, §4) |
| Re-explaining project conventions every session | Same tokens daily, forever | CLAUDE.md + skills (§4) |
| One endless conversation for a whole sprint | Compounding history resent every turn | One task per session, `/clear` between (§5) |
| Full-file rewrites | 5x-priced output tokens for unchanged lines | Targeted diffs (§5) |
| Letting an agent loop on a dead-end approach | Unbounded burn | Stop at 3 failures, re-ground or escalate cleanly (§5) |
| Ignoring caching in a custom harness | Paying full price for repeated context | Stable prefix + cache breakpoints (§6) |
| Max thinking effort on routine work | Thinking bills as 5x output | Effort low/default; escalate deliberately (§6) |

---

## The checklist

Before you prompt, five seconds of discipline:

1. **Right model?** Sonnet unless proven otherwise. Haiku for grunt work. Opus/Fable = escalation after failure, or planning-only.
2. **Grounded?** Real error, real files, pinned versions, docs supplied for anything exotic.
3. **Persistent knowledge captured?** If you're typing a convention for the second time, it goes in CLAUDE.md or a skill now.
4. **Context clean?** New task, new session. Relevant files only. Ask for diffs.
5. **Levers on?** Caching for repeated context, batch for async, output capped, effort matched to the task.

The developers with small bills aren't using AI less. They're just not paying flagship prices to have their repo re-read and their conventions re-taught forty times a day.

---

*Pricing sourced from Anthropic's official pricing documentation, July 2026. Verify current rates at [claude.com/pricing](https://claude.com/pricing) and [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing). Claude Code docs: [docs.claude.com/en/docs/claude-code/overview](https://docs.claude.com/en/docs/claude-code/overview).*
