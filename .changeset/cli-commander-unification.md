---
"@lsproxy/cli": major
---

Breaking: unified argument parsing onto Commander and changed the CLI grammar. The first positional argument is now either a language id or a filename (which anchors the request, replacing the old requirement to repeat the file later in the args):

- Old: `lsproxy <namespace> <command> <file> [args] [flags]` (e.g. `lsproxy textDocument hover src/foo.ts 12:7`)
- New: `lsproxy <language-or-file> <namespace> <request> [args] [flags]` (e.g. `lsproxy src/foo.ts textDocument hover 12:7`, or `lsproxy typescript textDocument hover src/foo.ts 12:7`)

`config` and `daemon` are now real Commander subcommands with consistent `--help` output. Added a new `lsproxy status` command showing configured language servers grouped by process, with resolved binary location, config source, live connection status, and served languages.
