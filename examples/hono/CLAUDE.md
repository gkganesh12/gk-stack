# CLAUDE.md — hono

Web framework built on Web Standards. Zero runtime dependencies. Library only — no UI, no dev server.

## Stack
- TypeScript 5.9.2 — strict, target ES2022, moduleResolution Bundler (tsconfig.base.json)
- Bun 1.2.20 (packageManager pin in package.json) — package manager + script runner; Node >=16.9.0 also supported
- Vitest 4.1.9, globals enabled; per-runtime vitest projects: node, workerd, fastly, lambda, lambda-edge (+ jsdom for jsx/dom)
- ESLint 9.39.3 via @hono/eslint-config 2.1.0; Prettier 3.7.4 (no semicolons, single quotes, printWidth 100)
- Multi-runtime targets via src/adapter/*: Cloudflare Workers/Pages, Deno, Bun, Node, Fastly, AWS Lambda, Lambda@Edge, Vercel, Netlify, service-worker

## Commands
- Install: `bun install --frozen-lockfile`
- Test (THE verification command): `bun run test`   # = tsc --noEmit && vitest --run
- Dev loop: `bun run test:watch`
- Per-runtime: `bun run test:node` | `test:workerd` | `test:fastly` | `test:lambda` | `test:lambda-edge` | `test:deno` | `test:bun`
- Lint: `bun run lint` (autofix: `bun run lint:fix`)
- Format check: `bun run format` (autofix: `bun run format:fix`)
- Build: `bun run build`   # build/build.ts → dist/; only when explicitly needed

## Verification
- After ANY code change run `bun run test` — must pass. tsc --noEmit catches type regressions; vitest runs the suite.
- This is a library with no UI: there is no browser or manual step. Types + tests are the entire verification story.
- If you touched src/adapter/* or runtime-specific code, also run the matching `test:<runtime>` script.

## Conventions
- One directory per middleware/helper: `src/middleware/<name>/index.ts` + colocated `index.test.ts`. Utils are flat files with a sibling `<name>.test.ts`. Tests always live next to source.
- Tests use vitest globals (no describe/it/expect imports), build a `new Hono()` app, and assert on `await app.request(...)` Responses.
- Core `src/` uses Web Standard APIs only (Request/Response, URL, crypto.subtle). Runtime-specific code goes in `src/adapter/<runtime>/`; `node:` imports outside adapters are exceptional (only context-storage's node:async_hooks, which all target runtimes support).
- Public files open with a `@module` JSDoc block; exported middleware/helpers carry full JSDoc: `@see` link to hono.dev docs, `@param`, `@returns`, `@example`.
- Type-only imports must be `import type` (eslint consistent-type-imports). A new public module also needs matching entries in package.json `exports` + `typesVersions` and in jsr.json.

## Workflow
- Non-trivial task → write a short plan first (files to touch, test strategy) before editing.
- If mid-task the architecture turns out to be wrong, STOP and write up what you found and the options — do not push through on a broken premise.

## Don't
- Don't add runtime dependencies. package.json has NO `dependencies` field at all — hono being zero-dependency is load-bearing. New devDependencies also require asking first.
- Don't touch generated paths: dist/, coverage/. Never hand-edit build output.
- Don't commit to main — branch + PR. PRs must pass `bun run test` (docs/CONTRIBUTING.md).
- Don't use Node-only APIs in core src/ — code must run on workerd, Deno, Bun, Fastly, and browsers.
- Don't produce low-effort output: the repo has an explicit AI usage policy (docs/CONTRIBUTING.md) — PRs that waste maintainer time may be closed without notice.

## Learned Rules
<!-- Append-only. When the agent gets something wrong: fix the code AND add one terse line here. Never rewrite or delete existing lines. -->
- /ship refuses on red verification — proven in this repo on 2026-07-04 (scratch-branch demo).
