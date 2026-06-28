---
'@lsproxy/cli': minor
'@lspeasy/core': minor
---

`lsproxy` help now surfaces param + result JSON Schema (`--json`) and illustrative
example input/output payloads (text) per request, derived from the LSP Zod schemas
(new `getResultSchemaForMethod` + `exampleFromZod`). `zodToCommander` generates
deeper flags (enums, scalar arrays, nested scalars) so common methods like
`textDocument/codeAction` are invokable without raw `--params`. Drill-down help and
`lsproxy config` output are now colored (TTY only; `--json` stays ANSI-free).
