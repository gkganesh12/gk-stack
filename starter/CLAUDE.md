# CLAUDE.md — <<PROJECT NAME>>
<!-- GK-Stack grounding file. Keep under 200 lines. Terse > complete. -->

## Stack
- <<Language + version, e.g. TypeScript 5.x strict>>
- <<Framework + version, e.g. Next.js 15 App Router>>
- <<Database/ORM, e.g. PostgreSQL 16 via Drizzle — schema in src/db/schema.ts>>
- <<Anything else the agent must never guess: auth lib, queue, cloud>>

## Commands
- Dev: <<npm run dev>>
- Test: <<npm test>>
- Typecheck/Lint: <<npm run typecheck && npm run lint>>
- Build: <<npm run build>>

## Verification  <!-- GK layer T: how you prove your work -->
After any code change, run: <<npm test && npm run typecheck>>
For UI changes: <<how to see it, e.g. dev server on :3000, check the affected page>>
Do not consider a task done until verification passes.

## Conventions
- <<e.g. Server components by default; "use client" only when needed>>
- <<e.g. All DB access through src/db/queries — no inline SQL elsewhere>>
- <<e.g. Errors: never swallow; use the AppError class in src/lib/errors.ts>>
- Prefer targeted edits over full-file rewrites.

## Workflow
- Non-trivial task → plan first; wait for approval before editing.
- Architecture feels wrong mid-task → stop, write up what you learned, propose the elegant redesign.

## Don't
- Don't add new dependencies without asking.
- Don't touch <<migrations / generated files / vendored dirs>>.
- Don't commit directly to main.

## Learned Rules  <!-- GK layer K: every mistake becomes a rule. Append-only. -->
<!-- When the agent gets something wrong, fix the code AND add one line here. -->
<!-- Example: - Use date-fns, not moment — moment was removed 2026-05. -->
- 
