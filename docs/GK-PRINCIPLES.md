# The GK Principles
### Seven layers, no tool required

GK-Stack's reference implementation is Claude Code, but the layers are properties of
**working with any coding agent** — Cursor, Codex, Copilot Workspace, your own harness.
If your tool can read files, run commands, and keep instructions, you can run the stack.
The letters spell the method.

## G — Ground

The agent works from real artifacts, never from your summary of them. Paste the actual
stack trace, the actual schema, the actual failing log. Point at working reference code
instead of describing it — code is unambiguous; prose about code is not. Keep one
grounding file per repo (whatever your tool loads automatically) holding the stack,
the commands, the conventions, and the learned rules: terse, current, under ~200 lines,
checked into git.

## K — Knowledge compounds

Every mistake becomes a written rule. When the agent does something wrong, fixing the
code is half the job — the other half is one terse line in the grounding file's
Learned Rules section so the mistake never needs correcting twice. Deep, occasional
expertise (deploy runbooks, API conventions, niche-library docs) lives in on-demand
modules — skills, rules files, whatever your tool loads lazily — so it costs nothing
when idle. All of it is version-controlled and team-shared: institutional knowledge
stops living in one senior dev's head.

## S — Spec before code

Plan until the plan is right; then execution one-shots. For any non-trivial task, make
the agent produce the plan first — files to touch, numbered steps, edge cases, what
"done" means — and iterate on *that*. A plan is cheap to change; forty edited files are
not. And when the architecture turns out wrong mid-build: stop, write up what was
learned, and rebuild clean. Restarting is cheap now; sunk-cost patching is not.

## T — Test & verify

The single biggest quality multiplier: give the agent a way to check its own work.
A test suite, a build exit code, a rendered page it can inspect — anything that returns
pass/fail turns "looks done" into "is done" and lets the agent iterate without you as
the feedback loop. Make the failing test the instruction ("make this pass" beats prose).
Review with fresh eyes: a second session that didn't write the code, told to flag only
correctness and requirement gaps — a reviewer asked to find gaps will otherwise invent them.

## A — Automate the inner loop

Anything you do three times a day becomes a command; anything that must happen every
time becomes a hook, not an instruction. Repeated workflows (verify-commit-push-PR,
triage the morning noise) get codified, checked into git, and shared. Instructions are
advisory; automation is deterministic — put formatting, lint, and guardrails on the
deterministic side.

## C — Context is a budget

One task, one session. A context window full of dead exploration taxes every subsequent
turn in quality and cost. Parallelize across isolated checkouts instead of piling tasks
into one conversation. Route models by stakes: strongest model for planning and gnarly
debugging (small volume, high leverage), mid-tier for well-specified execution — layers
S and T are exactly what make the cheaper tier safe. And keep always-on context lean:
every preinstalled extension, rule file, and skill description rides along on every
request, whether it earned the seat or not.

## K — Keep control

Velocity without guardrails is an incident report with good throughput. Pre-allow the
known-safe commands so the right thing is the default; deny the dangerous ones outright
(force-push, hook-bypassing commits, secrets paths). Every automated path ends at a
human gate — draft PR, digest, comment — never an unattended merge or deploy. Security
findings are report-only, always. Budgets, audit trails, and two-strike limits are part
of the stack, not bureaucracy around it.

---

**Adopting:** one layer a week beats a perfect setup on day one — G first, then S+T,
then K+A, then C+K. The [implementation guide](GK-STACK-IMPLEMENTATION.md) maps each
layer onto Claude Code specifically; the [PRD](GK-STACK-PRD.md) makes an agent do the
installation for you, under supervision — and [examples/hono/](../examples/hono/) shows
a real run of exactly that.
