Main CI is green as of today — the JSX type errors from 2026-06-23 were resolved in subsequent commits. Now I have enough to produce the full digest.

---

## Triage Digest — honojs/hono — 2026-07-04

### P0 — Broken for users right now

None. `main` CI is currently green (latest run on `a05813c`, 2026-07-04T10:31:03Z, all jobs passing).

---

### P1 — Real bugs, not currently CI-blocking

**[#5010](https://github.com/honojs/hono/issues/5010) — method-override `query` returns 500 on any request with a body** — BRIEF  
`src/middleware/method-override/index.ts:127` rebuilds the request from `ReadableStream` without `duplex: 'half'`. Per Fetch spec undici throws `TypeError: RequestInit: duplex option is required when sending a body`, surfaced as 500. The `form` and `header` branches build non-stream bodies and are unaffected. Existing tests use bodyless POSTs so CI stays green. Every HTML form POST to a query-override route is broken on Node/undici. Fix: add `duplex: 'half'` to the `RequestInit` at line 127.

**[#5010](https://github.com/honojs/hono/issues/5010) — compress middleware encodes 206 Partial Content** — BRIEF  
`src/middleware/compress/index.ts:92` skips on `Content-Encoding`/`Transfer-Encoding`/HEAD/threshold/type but not on `206` status or presence of `Content-Range`. A `206` ends up gzip-encoded while `Content-Range` describes the uncompressed byte range; range clients (video players, download managers) reassemble corrupted data. Fix: add `|| status === 206` guard.

**[#5010](https://github.com/honojs/hono/issues/5010) — aws-lambda adapter missing `globalThis.crypto` polyfill** — BRIEF  
`src/adapter/lambda-edge/handler.ts` polyfills `globalThis.crypto` for older Node Lambda runtimes; `src/adapter/aws-lambda/handler.ts` does not. Any function using `crypto.subtle` (JWT verify, hashing middleware) throws at first request on Node 18 Lambda. Fix: mirror the polyfill from `lambda-edge`.

**[#4992](https://github.com/honojs/hono/issues/4992) — `res()` setter silently drops `Set-Cookie` headers** — BRIEF  
When middleware sets `Set-Cookie` via `c.header()` before `next()` and the downstream handler returns a raw `Response` with its own `Set-Cookie`, one side's cookies are lost during the merge in the `res` setter. Reproducible: Node.js v24, Hono 4.12.18 (confirmed still present in issue comments from 2026-06-07). Root cause is in how the setter merges `#res` with a returned `Response` when `Set-Cookie` is multi-valued; open 5 comments, currently labeled `triage`.

**[#4981](https://github.com/honojs/hono/issues/4981) — `StreamingApi.pipe()` leaves writer permanently stale on `pipeTo()` rejection** — BRIEF  
`src/utils/stream.ts` lines 78–82: `releaseLock()` is called unconditionally before the `await body.pipeTo(...)`, but `getWriter()` is only called after the await succeeds. On any rejection (client disconnect, upstream error, abort signal), `this.writer` is left pointing to a released writer and `this.writable` holds no active writer. Subsequent `write()`/`writeln()`/`close()` calls throw `TypeError: This WritableStream writer has been released` or `the stream is locked`. Fix: wrap the `await` in `try/finally` with `getWriter()` in the `finally` block.

**[#5083](https://github.com/honojs/hono/issues/5083) / [PR #5084](https://github.com/honojs/hono/pull/5084) — etag ignores `If-None-Match: *` wildcard (RFC 9110 §13.1.2)** — BRIEF  
`src/middleware/etag/index.ts:32–36` splits `If-None-Match` on commas and compares each token via `stripWeak()`. `stripWeak('*') === 'abc'` is always false; the `*` wildcard is never matched. Per RFC 9110 §13.1.2, `*` must match any existing representation. PR #5084 is open, has passing CI (coverage +1 line), benchmark neutral (+0.95% average), and maintainer @yusukebe has asked @usualoma for review. Ready for merge pending review.

**[PR #5025](https://github.com/honojs/hono/pull/5025) — cache-control dedup is case-sensitive, duplicates directives** — BRIEF  
`src/middleware/cache/index.ts`: existing directive names are extracted from the `Cache-Control` header without lowercasing, but the new directive name is lowercased before the membership check — so `Max-Age` != `max-age` and the directive is emitted twice. Fix in PR is +19/-1 lines; no CI failures noted.

**[PR #5064](https://github.com/honojs/hono/pull/5064) — Content-Type matching is case-sensitive, drops `Application/JSON`** — BRIEF  
`validator()` and `parseBody()` compare Content-Type media types with case-sensitive equality; `Application/JSON` (valid per RFC 7230) is unrecognized and silently skipped. PR adds case-insensitive normalization (+48/-7). Tests added for mixed-case JSON and URL-encoded forms.

**[PR #5033](https://github.com/honojs/hono/pull/5033) — aws-lambda V2 event detection uses `rawPath` alone** — BRIEF  
`src/adapter/aws-lambda/handler.ts` infers event format version from the presence of `rawPath`. V1 events (ALB, custom authorizers) can also carry `rawPath`; the correct discriminator is `requestContext.version === '2.0'` or `requestContext.http` (present only in V2). Misdetection flips response format and breaks V1 routes.

---

### P2 — Chores

**[PR #5039](https://github.com/honojs/hono/pull/5039) — broken JSDoc @example in context-storage** — SKIPPED (read-only mode)

**[PR #5081](https://github.com/honojs/hono/pull/5081) — add JSDoc @example to languageDetector** — SKIPPED (read-only mode)

**[PR #5063](https://github.com/honojs/hono/pull/5063) — useRef overloads: autofix.ci failure** — SKIPPED (read-only mode)  
The `autofix.ci` job failed (run 28495478683, 32s). This is a code-style push-back from the autofix bot on the fork; the PR author's own `tsc --noEmit` checklist passes. Needs the author to run `bun run format:fix` and push.

**[PR `refactor-context` / run 27349668192](https://github.com/honojs/hono/runs/27349668192) — context method-binding perf PR fails JSR slow-types check** — SKIPPED (read-only mode)  
Deno JSR validation emits `missing-explicit-return-type` on `src/context.ts` lines 461, 476, 501, 776, 804. Five public methods need explicit return-type annotations before the PR can land.

**[#4936](https://github.com/honojs/hono/issues/4936) — introduce GitHub Actions linters** — SKIPPED (read-only mode)

---

### Noise — features, duplicates, unanswered questions

| # | Summary | Classification |
|---|---------|---------------|
| [#5072](https://github.com/honojs/hono/issues/5072) | Auto-docs like FastAPI | feature — noise |
| [#5048](https://github.com/honojs/hono/issues/5048) / [PR #5049](https://github.com/honojs/hono/pull/5049) / [PR #5070](https://github.com/honojs/hono/pull/5070) | HTTP QUERY method (two competing PRs) | feature — coordinate before merging either |
| [#5056](https://github.com/honojs/hono/issues/5056) | useRef overload proposal | addressed by PR #5063 — close as duplicate |
| [#5046](https://github.com/honojs/hono/issues/5046) | Early Hints (`103`) support | feature — noise |
| [#5018](https://github.com/honojs/hono/issues/5018) / [#5017](https://github.com/honojs/hono/issues/5017) | Official rate-limiter / universal cache middleware | feature — scope better as `@hono/*` packages, not core |
| [#4993](https://github.com/honojs/hono/issues/4993) | WebExtensions adapter | feature — noise |
| [#4976](https://github.com/honojs/hono/issues/4976) | "WebSocket doesn't work" | triage — too vague, needs repro |
| [#4989](https://github.com/honojs/hono/issues/4989) | Configurable WWW-Authenticate realm for jwt/jwk | minor feature — noise |
| [#4954](https://github.com/honojs/hono/issues/4954) | DetailedError RPC typing | enhancement — noise |
| [#4949](https://github.com/honojs/hono/issues/4949) | Split adapters into separate packages | refactoring proposal — noise |
| [#4938](https://github.com/honojs/hono/issues/4938) / [#4937](https://github.com/honojs/hono/issues/4937) | WinterTC Sockets adapter / replace ConnInfo | enhancement — noise |
| [#4895](https://github.com/honojs/hono/issues/4895) | Middleware error interception | feature — noise |
| [#4842](https://github.com/honojs/hono/issues/4842) | TracingChannels observability | feature — noise |
| [PR #5038](https://github.com/honojs/hono/pull/5038) | Detailed response inference type (client) | enhancement — noise |
| CI runs 27181702818 / 27181367857 / 27181964781 / 27133947132 | Fork-merge and release pipeline failures from 2026-06-09 | stale — resolved by subsequent commits |

---

### Sources not reached

- CI run 27087210601 (`fix-merge-header-2`): log retrieved but only showed a coverage-upload dependency error (missing required deps in the Coverage job) — the specific missing dependency name was not surfaced in the truncated output. The PR branch `fix-merge-header-2` is no longer listed as open; likely abandoned or superseded.
- Release run 27181964781 (`4.12.25`, 28s): too short to be a test failure — likely a tag/publish step that failed due to network or auth. Release `4.12.25` appears to have shipped successfully (it's referenced in issues), so this is stale noise.
