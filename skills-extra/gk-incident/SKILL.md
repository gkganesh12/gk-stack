---
name: gk-incident
description: >-
  Structured incident response for production issues: severity triage,
  mitigation-first playbook, evidence capture, timeline, and a postmortem that
  feeds Learned Rules. Triggers on "incident:", "production is down", "we have
  an outage", "sev1", "sev2", "users are affected right now", "postmortem",
  "write the incident report".
---

# GK Incident

Bugs get diagnosed; incidents get *stopped*. The difference is ordering: in an
incident, mitigation comes before root cause, communication comes on a clock, and
every action is logged for the postmortem. This skill runs that ordering so the
human runs the incident.

## Absolute rules

- **The agent never touches production.** It prepares — rollback commands, flag
  flips, diagnosis, comms drafts — and the human executes. Every prepared action is
  printed with its blast radius and its undo.
- **Mitigate first, diagnose second.** The cheapest safe path back to green (revert,
  flag off, scale up, failover) beats a root-cause hunt while users bleed.
- **Security incidents are report-only, always** (PRD non-goal): suspected breach,
  leaked secret, authz bypass → evidence capture + escalation brief. No remediation
  attempts — not even "helpful" ones.
- **Everything is timestamped** into `gk/incidents/<date>-<slug>/TIMELINE.md` as it
  happens, not reconstructed later.

## Procedure

### Step 1 — Triage (2 minutes, then act)
Classify: **SEV1** users broken now / **SEV2** degraded or broken-for-some /
**SEV3** contained, fix-during-hours. State the blast radius in one sentence from
evidence (error rates, failing endpoint, affected tenant) — paste real signals, never
summaries. If evidence is missing, the first action is getting it.

### Step 2 — Mitigation menu
Present the 2–3 cheapest safe paths back to green, each with: the exact command or
click-path, expected effect, blast radius, undo. Ranked. The human picks; the agent
records the choice and outcome in the timeline.

### Step 3 — Comms drafts (on a clock)
Draft status updates in plain English (no stack traces, no blame): initial
acknowledgment, then updates at the cadence the human sets. Two audiences per the GK
convention — internal (technical, linked evidence) and client-facing (impact + ETA).

### Step 4 — Root cause, once green
Now diagnose properly — hand off to gk-fix-bug for the code-level workflow (regression
test before fix). The incident stays open until the fix is verified AND the mitigation
is unwound.

### Step 5 — Postmortem → Learned Rules
Generate `POSTMORTEM.md` from the timeline: impact window, detection gap (when it
started vs. when we noticed), what worked, what was luck. Blameless — systems and
signals, not names. End with the two mandatory feedback lines:
1. ≥1 one-line addition to CLAUDE.md → Learned Rules
2. ≥1 detection improvement (alert, check, test) filed as follow-up work

## Output

During: timeline entries + prepared actions, one decision at a time. After: the
postmortem, the Learned Rules line(s), and the follow-up list. No incident closes
without Step 5 — that's the K layer doing its job under fire.
