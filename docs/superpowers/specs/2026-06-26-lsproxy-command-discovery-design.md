# Design: Progressive, capability-aware command discovery for `lsproxy`

- **Date:** 2026-06-26
- **Status:** Approved (pending spec review)
- **Package(s):** `apps/cli` (`@lsproxy/cli`), `apps/proxy` (`@lsproxy/proxy`), `packages/core` (`@lspeasy/core`)

## Problem

Running `lsproxy` with no arguments prints a hardcoded `STATIC_HELP` string
(`apps/cli/src/cli.ts:24-44`) that lists global flags but deliberately names
**zero** namespaces or commands — "Available commands depend on the connected
server's advertised capabilities." The real command tree
(`textDocument hover`, `workspace symbol`, …) only materializes after the CLI
connects to a server *with a file argument* and runs `buildCommandTree`
(`apps/cli/src/build-commands.ts`). A new user — or an agent — has no
discoverable entry point: they cannot see which languages the project is set up
for, what each server supports, or how a given request is parameterized without
already knowing the grammar.

## Goals

- Bare `lsproxy` shows **dynamic current state**: the languages/servers
  configured for this project plus live health and stats.
- A **progressive drill-down** keyed on language/server lets the caller go
  language → namespace → request → parameter schema.
- Per-language command lists are **capability-filtered** against the live
  server, not a static catalog.
- `--json` output is a **stable, ANSI-free, parseable contract** suitable for
  agent invocation; color/symbols are strictly the human-TTY view.

## Non-goals

- No change to execution mode (`lsproxy <namespace> <command> <file>`); language
  stays inferred from the file there.
- No active spawn-testing of cold servers on the bare command (would spawn N
  processes as a side effect of help).
- No new stats beyond status / uptime / open-documents / requests-served /
  healthy (memory and idle-countdown are explicitly out of scope — YAGNI).
- No static-catalog fallback for per-language lists: drill-down is live-only
  (a server that won't start surfaces as an error, not a fabricated tree).

## Invocation grammar & routing

Help mode is keyed on the `--help` flag, which `parseArgs` already extracts in
pass-1 (`apps/cli/src/cli.ts:97-102`). Positionals **after `--help`** mean
`[language, namespace, request]`:

| Invocation | Output |
|---|---|
| `lsproxy` *(or `lsproxy --help`)* | Top-level: configured languages/servers + live health & stats |
| `lsproxy --help <lang>` | Capability-filtered namespaces for that server |
| `lsproxy --help <lang> <ns>` | Requests in that namespace |
| `lsproxy --help <lang> <ns> <req>` | Parameter schema for that request |

Execution mode (`lsproxy <namespace> <command> <file>`) is **unchanged**. The
`--help` flag is the unambiguous mode switch, so the differing meaning of
positional[0] across the two modes (language in help mode, namespace in
execution mode) never collides.

`--json` is honored in every help-mode level: it emits the structured object
(see §"JSON contract") and suppresses all color/symbols.

## Component 1 — Top-level listing (`apps/cli`)

Replaces the `STATIC_HELP` branch (`cli.ts:104-107`) with a dynamic renderer
that merges two sources:

1. **Config** — new core enumerator `discoverServers(root)` (see Component 4)
   returns every configured server with its languages and extensions.
2. **Live state** — a quick `tryConnect` to the daemon socket (reuse the helper
   pattern from `apps/cli/src/connect.ts:14`). If the daemon is up, send
   `$/lsproxy.status` and overlay per-language health/stats. If down, render all
   configured languages as cold under a `daemon: down` header.

Each row renders: status symbol + language + extensions + (when warm) stats. A
footer hints the next drill-down level (`lsproxy --help <language>`).

## Component 2 — Drill-down levels (`apps/cli`)

For `lsproxy --help <lang> [<ns> [<req>]]`:

1. Resolve the server via `discoverServerByLanguageId(root, lang)`
   (`packages/core/src/discover.ts:127`).
2. Connect through the proxy with **`indexWaitMs: 0`** — capabilities arrive in
   the LSP `initialize` response (`apps/proxy/src/client-session.ts:122`), well
   before any indexing, so help never pays the default 15s index wait
   (`cli.ts:206`).
3. Run the existing `buildCommandTree(program, session.capabilities, …)` to get
   the capability-filtered Commander tree.
4. **Delegate to Commander's built-in help** for the targeted sub-path:
   - depth 1 → the namespace command's help (lists requests)
   - depth 2 → the request command's help (lists parameters; already produced by
     `zodToCommander`)

An unknown language, namespace, or request produces a clear error listing valid
siblings at that level. A server that fails to start surfaces the connection
error (no fabricated tree).

## Component 3 — Proxy `$/lsproxy.status` control message (`apps/proxy`)

New request intercepted in `ClientSession.handleRequest`
(`apps/proxy/src/client-session.ts:94`) alongside the existing
`initialize`/`shutdown` special-cases, so it never routes to a language backend.
The session stays thin: an injected `onStatus()` provider (mirroring the
existing `onEnd` option, `client-session.ts:14`) is implemented by `ProxyServer`,
which has access to daemon-level facts, the `BackendPool`, and the
`DocumentStateManager`.

Supporting additions:

- `BackendEntry` gains `startedAt: number` and `requestCount: number`
  (`apps/proxy/src/backend-pool.ts:44`). `requestCount` is incremented in the
  pool on each forwarded request (a `recordRequest(languageId)` call from the
  request path) so the count is shared across sessions, not per-session.
- `BackendPool.listBackends()` exposes `{ languageId, pid, startedAt,
  requestCount, healthy }` per warm backend, where `healthy = proc.exitCode === null`.
- `DocumentStateManager.countByLanguage(): Record<string, number>` derives open
  document counts from `this.docs` (each `DocEntry` carries `languageId`,
  `apps/proxy/src/document-state.ts:11`).
- `ProxyServer` records its own `startedAt` and assembles daemon-level fields
  (`pid`, `uptimeMs`, `root`, `sessions`, `backends`).

## JSON contract (the agent-facing API)

`$/lsproxy.status` response and `lsproxy --json` top-level output share this
shape. This object is the contract; the colored table is a view over it.

```jsonc
{
  "daemon": {
    "pid": 12345,
    "uptimeMs": 84213,
    "root": "/path/to/project",
    "sessions": 1,
    "backends": 2
  },
  "languages": [
    {
      "languageId": "typescript",
      "name": "typescript",            // lsp.json server key
      "extensions": [".ts", ".tsx"],
      "command": "typescript-language-server --stdio",
      "status": "running",             // "running" | "cold"
      "healthy": true,                 // present only when running
      "pid": 12378,                    // present only when running
      "uptimeMs": 80112,               // present only when running
      "openDocuments": 3,              // present only when running
      "requestsServed": 47             // present only when running
    }
  ]
}
```

When the daemon is down, `daemon` is `null` and every language has
`status: "cold"` with the running-only fields omitted. Output is newline
terminated. No ANSI bytes ever appear in `--json` mode.

## Component 5 — Color & symbol presentation (`apps/cli`)

A small CLI-local `format.ts`:

- ANSI helpers (green / red / yellow / dim) and status glyphs:
  `●` running (green), `○` cold (dim), `✓` healthy, `✗` unhealthy (red),
  `⚠` degraded (yellow). Stats are dimmed.
- Color is **gated on `process.stdout.isTTY && !process.env.NO_COLOR &&
  !flags.json`**. Pipes, CI, and `--json` get plain output.

## New surface area

| Area | Addition |
|---|---|
| `packages/core/src/discover.ts` | `discoverServers(root): ConfiguredServer[]` enumerator |
| `apps/proxy/src/backend-pool.ts` | `startedAt`/`requestCount` on entry, `recordRequest()`, `listBackends()` |
| `apps/proxy/src/document-state.ts` | `countByLanguage()` |
| `apps/proxy/src/proxy-server.ts` | `startedAt`, status assembly, `onStatus` wiring into `ClientSession` |
| `apps/proxy/src/client-session.ts` | `$/lsproxy.status` branch + `onStatus` option |
| `apps/cli/src/cli.ts` | help-mode router replacing `STATIC_HELP` branch |
| `apps/cli/src/help.ts` *(new)* | top-level renderer + drill-down orchestration |
| `apps/cli/src/format.ts` *(new)* | ANSI + symbol helpers, TTY/`--json`/`NO_COLOR` gating |

## Error handling

- Daemon down on bare `lsproxy` → render config-only with `daemon: down`; never
  an error (discovery must work offline).
- `--help <lang>` for an unconfigured language → error listing configured
  languages.
- `--help <lang> <ns>`/`<req>` with an unknown namespace/request → error listing
  valid siblings at that level.
- Server fails to start during drill-down → surface the connection error; do not
  fabricate a static tree.
- `--json` + any of the above → structured `{ ok: false, error }` (consistent
  with existing `call` error handling, `build-commands.ts:123-130`).

## Testing

- **core** — `discoverServers()` over a fixture `lsp.json` (multiple servers,
  multiple extensions, missing config → empty list).
- **proxy** — `$/lsproxy.status` returns expected daemon + backend shape;
  `BackendPool.listBackends()`/`recordRequest()`; `countByLanguage()`; follow
  existing `backend-pool.test.ts` / `document-state.test.ts` patterns.
- **cli** — help-mode router dispatches by positional depth; top-level renderer
  with daemon up and down (status JSON mocked); drill-down delegates to the
  right Commander sub-path; unknown language/namespace/request errors;
  `format.ts` color-off output is byte-stable; `--json` output matches the
  contract and contains no ANSI.
- **e2e** — bare `lsproxy` and each `--help` depth against a real fixture
  server; `--json` parses and validates against the documented shape.
