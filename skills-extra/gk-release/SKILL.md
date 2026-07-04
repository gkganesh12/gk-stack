---
name: gk-release
description: >-
  Release management with hard preflight gates: verification green, semver
  decision with evidence, changelog and two-audience release notes, tag, DRAFT
  release, and a rollback plan — publishing stays human. Triggers on "release:",
  "cut a release", "ship a version", "prepare the release", "bump the version",
  "release notes", "tag a version".
---

# GK Release

A release is the moment unverified work becomes everyone's problem. This skill makes
the preflight mechanical, the notes readable by two audiences, and the publish button
human — the release equivalent of `/ship` refusing on red.

## Absolute rules

- **Red preflight = no release artifacts.** No tag, no notes, no version bump until
  every gate passes. Report the failure and stop — same discipline as /ship.
- **Everything ends in DRAFT.** Draft GitHub release, unpushed tag, staged changelog.
  The human reviews and publishes. The agent never runs the publish/deploy step —
  deployment belongs to gk-deploy, after the human ships the release.
- **No release without a rollback plan.** If "how do we undo this" has no answer,
  that's a preflight failure, not a footnote.

## Procedure

### Step 1 — Preflight gates (all must pass)
1. Full verification from CLAUDE.md — green, output shown
2. Working tree clean; on the release branch; no unmerged release-blocking PRs
   (`gh pr list --label release-blocker`)
3. Changelog current — invoke gk-changelog if `[Unreleased]` is stale
4. No open SEV1/SEV2 incident (check `gk/incidents/` for unclosed timelines)
5. Security scan clean or findings acknowledged by the human — report-only per PRD

### Step 2 — Version decision (evidence, not vibes)
Diff since last tag → propose the semver bump with the evidence list: breaking
changes (major), new capabilities (minor), fixes only (patch). Pre-1.0 or
non-semver repos: follow the repo's observed convention and say which. Human confirms.

### Step 3 — Release notes, two audiences
From the changelog and merged PRs since last tag:
- **Developer notes:** precise — breaking changes with migration steps first, then
  features, fixes, deps. Every item links its PR.
- **Client-facing notes:** plain English, what-changed-for-you, zero file paths,
  zero ticket IDs (the GK two-audience convention).

### Step 4 — Cut, as drafts
Version bump commit (only the canonical version files the repo actually uses) →
annotated tag, **not pushed** → `gh release create --draft` with the developer notes
→ print the exact publish commands for the human, including the tag push.

### Step 5 — Rollback plan
One short section in the draft release: previous-good tag, the revert/redeploy
command, data/migration caveats (call out anything irreversible), and the first
metric to watch post-release.

### Step 6 — Learn
Anything that made this release harder than it should have been (flaky gate, manual
step, missing script) → one Learned Rules line or a follow-up automation task.
Releases should get more boring every time.

## Output

One release brief: gates table (pass/fail each), version + evidence, both sets of
notes, draft-release link, rollback plan, and the human's publish commands. A red
gate produces the failure report instead — never a partial release.
