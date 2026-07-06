# CLI: unify on Commander, unify grammar, fix help/behavior drift

## Problem

`apps/cli/src/cli.ts` parses arguments in two passes: `node:util`'s
`parseArgs` extracts global flags first (needed before an LSP session
exists), then Commander builds and dispatches a capability-derived
subcommand tree. On top of that, real dispatch (`main()`) and `--help`
(`runHelp()`) are two separate hand-maintained code paths with their own
positional grammars. This has caused real drift between what the CLI
documents and what it does:

1. `config` and `daemon` are hand-rolled positional `if/else` chains with
   a manually written `usage: ...` string shown only on error — unlike
   every LSP method, which is a real Commander command with generated
   usage, options, and examples.
2. `runHelp()` builds the Commander tree but never registers the global
   options that `main()`'s real-dispatch path registers, so
   `lsproxy --help <lang> <ns> <request>` never shows `--dry-run`,
   `--root`, `--json`, etc., even though they're accepted at runtime.
3. The top-level `lsproxy` help documents `config`, `daemon`, `call`,
   `--version` but no other global flag at all.
4. The top-level Usage line (`lsproxy <language> <namespace> <request>
   [args] [flags]`) shows a `<language>` token that real dispatch never
   actually accepts — `main()` never reads a language positional at all;
   language is inferred from the file argument's extension. Meanwhile
   the *separate* `--help <language> <namespace> <request>` grammar
   genuinely does require a language token, since help mode has no file
   to infer it from. Same word, two different (and differently correct)
   requirements, documented as one.
5. Because real dispatch and help are separate code paths with separate
   grammars, an incomplete real command (missing a required arg) gets a
   raw Commander "missing required argument" error instead of the
   helpful drill-down view `--help` would have shown for the same path.

Root causes: global-option metadata is declared in three unsynchronized
places, `config`/`daemon` never joined the Commander tree, and dispatch
vs. help are two grammars instead of one tree walked to different
depths.

## Approach

Two changes, done together because the second is what actually
eliminates the dispatch/help duplication that causes (2), (4), and (5):

**A. Parser unification.** Replace `node:util`'s `parseArgs` with
Commander's own `Command.parseOptions(args)` — it scans the full
argument list, resolves declared options anywhere in it, and returns
`{ operands, unknown }` without requiring the rest of the command tree
to exist yet. This is exactly the primitive the two-pass design needs,
so pass 1 becomes Commander too. `config` and `daemon` become real
Commander command trees instead of hand-written `if/else` + usage
strings.

**B. One grammar for dispatch and help.** The first positional becomes
`<language-or-file>`: either a configured language id (e.g.
`typescript`) or a file path (whose extension resolves the language,
*and* which becomes the implicit target file for the request — no need
to repeat it). Namespace and request follow, exactly matching today's
`--help <language> <namespace> <request>` shape. Real dispatch and help
become the same tree walk to whatever depth was given:

```
lsproxy                                              → status/language list
lsproxy <language-or-file>                           → namespaces for that server
lsproxy <language-or-file> <namespace>                → requests in that namespace
lsproxy <language-or-file> <namespace> <request> [args] [flags]
                                                      → executes if complete,
                                                        shows params/example if not
lsproxy <language-or-file> call <method> [--params <json>]
lsproxy config <list|import|export|diff> [platform] [--user] [--json]
lsproxy daemon <start|stop|status>
```

Both of these forms are supported, matching the two ways to supply the
first token:

```bash
lsproxy typescript textDocument hover src/foo.ts 12:7    # language, then file
lsproxy src/foo.ts textDocument hover 12:7                # file doubles as anchor
```

`--help`/`-h` still forces the drill-down view even for an otherwise
complete call (e.g. "show me the schema for `textDocument hover` even
though I could run it"). Whether reached via `--help` or via an
incomplete invocation, the *same* renderer (`renderDrillDownText`/
`drillDownJson`) produces the view — there is no longer a separate
`runHelp()` grammar to keep in sync.

This is a breaking change to CLI syntax (no `<namespace> <request>
<file> ...`-without-language fallback) — acceptable per the repo's
current pace of change; docs, README, and tests move to the new
grammar in the same change.

### Why not alternatives

- **Capability-blind single pass** (register every LSP method up front,
  check support inside the action instead of filtering at help-build
  time) would let parsing be genuinely one pass, but it breaks the
  documented "help only shows what the connected server actually
  supports" behavior. Rejected.
- **Hand-rolled pre-scanner instead of `parseArgs`** — reimplements what
  Commander's `parseOptions` already does. Rejected.
- **Keep dispatch/help as two grammars, just patch the specific bugs**
  — would fix points 1–3 but leaves 4 and 5 as permanent duplication
  risk (two hand-maintained trees can drift again). Rejected in favor
  of collapsing them structurally.

## Design

### 1. Shared global-option registry

`GLOBAL_OPTIONS: ReadonlyArray<{ flags: string; description: string }>`
replaces `GLOBAL_OPTION_CONFIG`. `registerGlobalOptions(cmd: Command)`
applies it. Used by the pass-1 scanning command and the single program
built for dispatch/help (see §3). One list; a "Global options:" section
in the top-level view and a help footer on every leaf command are both
generated from it, so they can't drift again.

`--version`/`-V` and `--help`/`-h` stay plain boolean options on the
pass-1 command (not Commander's `.version()`/default help wiring, which
have eager side effects) — checked manually after `parseOptions()`,
same as today.

### 2. Pass 1: `parseOptions` replaces `parseArgs`

```ts
const scan = new Command('lsproxy').allowUnknownOption(true);
registerGlobalOptions(scan);
scan.option('-V, --version').option('-h, --help');
const { operands, unknown } = scan.parseOptions(argv.slice(2));
const positionals = [...operands, ...unknown].filter((t) => !t.startsWith('-'));
const flags = buildFlags(scan.opts());
```

`positionals[0]` is now `config` / `daemon` / `version` / a
language-or-file token (routing decided in §3). `buildFlags` keeps its
existing validation.

### 3. Routing: meta-commands vs. language-or-file dispatch

```
positionals[0] === 'version'          → print CLI_VERSION, exit
positionals[0] === 'config'           → build config-only Command tree, parseAsync, exit
                                         (no session ever connects)
positionals[0] === 'daemon'           → build daemon-only Command tree, parseAsync, exit
positionals.length === 0              → top-level status view (unchanged), exit
otherwise                             → language-or-file dispatch (below)
```

**Resolving `<language-or-file>` (`positionals[0]`):**
1. Exact match against a configured language id (`allConfiguredServers`)
   → resolve via `resolveByLanguageId`, no implicit anchor file.
2. Else, if it has a file extension → resolve via `resolveByExtension`
   on that extension; the token itself becomes `anchorFile`.
3. Else → error listing configured languages (same shape as today's
   "No server configured for language" error).

Connect the session (proxy or direct, same logic as today), open
`anchorFile` if resolved, then build the Commander tree via
`buildCommandTree(program, capabilities, session, flags, anchorFile)`.
`config`/`daemon` are routed above and never reach this branch; this
tree is just the capability-derived namespaces plus `call`.

**Walking the rest (`positionals.slice(1)`, `path = [namespace, request, ...args]`):**
- `path.length === 0` → depth-1 drill-down (namespaces for this server).
- `path.length === 1` → depth-2 drill-down (requests in that namespace).
- `path.length >= 2` and `helpMode` → depth-3 drill-down for
  `[namespace, request]`, ignoring any trailing args.
- `path.length >= 2` and not `helpMode` → hand the full original argv
  (rewritten so Commander sees `<namespace> <request> [args] [flags]`,
  global options already stripped) to `program.parseAsync`. The program
  uses `exitOverride()`; a caught `CommanderError` with
  `code === 'commander.missingArgument'` (or `.missingMandatoryOptionValue`)
  falls back to the same depth-3 drill-down render instead of Commander's
  default stderr message. Any other error propagates as today.

This replaces `runHelp()` entirely — depth 0–2 drill-down and the
depth-3 fallback both call the existing `renderTopLevel` /
`renderDrillDownText` / `drillDownJson` functions; `main()` is the only
caller.

### 4. `zodToCommander` / `buildCommandTree`: optional anchor file

`zodToCommander(method, schema, session, flags, anchorFile?)` and
`buildCommandTree(..., anchorFile?)` gain an optional pre-resolved
anchor. When present and the method's arg pattern includes a leading
`<file>` (`file-position-newname`, `file-position`, `file-range`,
`file`), that positional is **not** declared on the Commander command —
the remaining pattern args shift down by one (e.g. `file-position`
becomes just `<line:col>`). The action handler uses `anchorFile` in
place of `positional[0]` when marshaling params. When `anchorFile` is
absent, behavior is unchanged (file stays a required positional).
`query`/`raw` patterns are unaffected either way — `anchorFile` there
only matters for opening the document to warm the server, exactly as
`main()` already does today via `session.open(absPath)`.

### 5. Top-level view corrections

`renderTopLevel`'s Usage section changes to reflect the real, now-unified
grammar (§ Approach) instead of the old, inaccurate line. The separate
"Drill down:" section is replaced by a shorter "Explore:" section
showing that fewer args = shallower view — since it's the same command,
not a different `--help`-prefixed one. A new "Global options:" section
is added, generated from `GLOBAL_OPTIONS`.

### 6. Testing

- `build-commands.test.ts`: `zodToCommander`/`buildCommandTree` with and
  without a pre-resolved `anchorFile`, asserting the `<file>` argument
  is omitted/present accordingly and that marshaled params use the
  anchor when omitted.
- `integration.test.ts`: both invocation forms
  (`<language> <namespace> <request> <file> <pos>` and
  `<file> <namespace> <request> <pos>`) produce identical results;
  `config`/`daemon` help is Commander-generated; an incomplete real
  command (e.g. `lsproxy typescript textDocument hover` with no file)
  renders the same text as the equivalent explicit depth-3 view;
  `--help` still forces the drill-down view for an otherwise-complete
  command.
- Existing tests for `--wait` validation, `--version`, bare `lsproxy`,
  and the old two-positional grammar are updated to the new grammar
  (breaking change — no dual-mode parsing to characterize).
- README quick-start / usage examples updated to the new grammar.

## Non-goals

- `apps/proxy/src/main.ts` keeps `parseArgs` — separate, much simpler
  daemon entry point, not part of this drift.
- No change to which capabilities gate which commands, or to
  `marshalParams`'s per-pattern field mapping beyond the anchor-file
  shift described in §4.
