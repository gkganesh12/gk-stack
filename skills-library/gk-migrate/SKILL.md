---
name: gk-migrate
description: >-
  Runs repo-wide migration campaigns (codemods, API swaps, framework upgrades)
  as a gated pipeline: plan → 3-file pilot → headless per-file batch → verify →
  one rollup PR. Triggers on "migrate:", "migration campaign", "codemod",
  "upgrade across the repo", "rename across the codebase", "apply this change
  to every file", "mass refactor", "repo-wide change".
---

# GK Migrate

Large-scale migrations fail in two ways: one heroic session that drowns in context,
or an unsupervised loop that mangles half the repo before anyone looks. This skill is
the assembly line between those failures — small fresh contexts, hard gates, one
human-reviewed rollup at the end. Implements PRD R16.

## Absolute rules

- **The pilot gates the batch.** No batch run until 3 pilot files pass review and
  verification. If the pilot needs prompt changes, re-pilot — never "fix it in the batch."
- **Two strikes per file.** A file that fails twice is logged to `gk/migrate/failed.md`
  and skipped. The campaign never loops on one file.
- **Never merge, never push to main.** The campaign ends at ONE rollup PR (or a small
  set of themed rollup PRs for very large campaigns) — a human merges.
- **Batch runs on the mid/cheap tier** (Sonnet; Haiku for mechanical renames). Planning
  and pilot-review run on the strong tier. Escalating a stuck file is a human decision.

## Procedure

### Step 1 — Campaign spec (strong model, plan mode)
Write `gk/migrate/<campaign>/SPEC.md`: the transformation (before → after, with one
worked example), the discovery rule (glob/grep that finds every candidate file), what
must NOT change, and the per-file verification command (fast subset — full suite runs
at rollup, not per file).

### Step 2 — Discovery
Generate the work list into `gk/migrate/<campaign>/files.txt` using the discovery rule.
Report the count. If >2,000 files, propose splitting into themed sub-campaigns.

### Step 3 — Pilot (3 files, supervised)
Pick 3 representative files: one typical, one gnarly, one edge case. Migrate them in
the main session. Run verification. Show the human the diffs. **STOP for approval.**
Fold every pilot lesson back into SPEC.md — the batch prompt is generated from it.

### Step 4 — Headless batch
```bash
while read f; do
  claude -p "Migrate $f per gk/migrate/<campaign>/SPEC.md. Run <per-file verify>.
  Output OK or FAIL: <reason>." \
    --allowedTools "Edit,Read,Bash(<verify-cmd>)" --model sonnet
done < files.txt
```
One fresh context per file, scoped tools, no git access — the batch edits, it does not
commit. Log OK/FAIL per file to `gk/migrate/<campaign>/log.md`. Apply the two-strike
rule on FAILs (one retry with the failure reason added to the prompt).

### Step 5 — Verify & rollup
Run the FULL verification suite from CLAUDE.md. Then: one branch, one commit series
(discovery manifest → migrated files → failed-file list), one rollup PR whose
description includes the spec, the pilot diffs, counts (migrated / skipped / failed),
and the full-suite result. Failed files are listed in the PR as explicit follow-up work.

### Step 6 — Learn
Every batch failure pattern becomes a line in CLAUDE.md → Learned Rules, and SPEC.md
is archived — the next campaign starts from a better template.

## Output

Campaign digest: files discovered / migrated / skipped (two-strike) / verification
status / rollup PR link. One message, decision-ready.
