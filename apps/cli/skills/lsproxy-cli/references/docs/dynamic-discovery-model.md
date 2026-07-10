# Dynamic discovery model

The CLI uses a dynamic discovery model — the help surface is built from live
server capabilities and `lsp.json` config, not a static command list.

The same tree is used for real dispatch: `lsproxy <language-or-file> <namespace> <request>`
without enough args to actually run shows the same view as the equivalent
`--help` invocation below.

**Depth 0 — bare `lsproxy` (or `lsproxy --help`)**

Lists every configured language with live daemon status (pid, uptime, docs, reqs)
or cold status (configured but not yet started). Add `--json` for machine-readable
output suitable for agents.

**Depth 1 — `lsproxy --help <language>`**

Connects to that language's server and shows its advertised namespaces
(`textDocument`, `workspace`, etc.) filtered to what the server actually supports.

**Depth 2 — `lsproxy --help <language> <namespace>`**

Lists available requests within that namespace for the running server.

**Depth 3 — `lsproxy --help <language> <namespace> <request>`**

Shows the Commander help for that specific command (positional args + all
flag-mapped params), followed by illustrative **Example input** and **Example
output** generated from the Zod schemas. Add `--json` to receive a structured
response with `arguments`, `options`, `paramsSchema`, and `resultSchema` fields —
useful for building agent prompts or automation scripts.

```bash
# Text mode — human-readable
lsproxy --help typescript textDocument codeAction

# JSON mode — machine-readable (paramsSchema + resultSchema included)
lsproxy --help typescript textDocument codeAction --json
```