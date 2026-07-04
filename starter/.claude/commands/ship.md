---
description: Verify, then commit, push, and open a PR for the current changes
---

## Pre-computed context
- Status: !`git status --short`
- Branch: !`git branch --show-current`
- Diff stat: !`git diff HEAD --stat`

## Your task

1. **Verify first.** Run the Verification steps from CLAUDE.md. If anything fails,
   STOP — report the failure and do not commit. Shipping unverified work is not shipping.
2. Review the diff above. If it contains unrelated or accidental changes, ask before proceeding.
3. Stage the relevant files and write a conventional commit message
   (feat/fix/refactor/docs/chore: imperative, <72 chars, body explains the why).
4. If we are on main, create a sensibly named branch first.
5. Push and open a PR with `gh pr create` — title matches the commit,
   description covers: what changed, why, and how it was verified.
6. Reply with the PR link only.
