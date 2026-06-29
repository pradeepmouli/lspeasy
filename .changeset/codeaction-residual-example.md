---
"@lsproxy/cli": patch
---

Drill-down help (`lsproxy --help <lang> <ns> <request>`) now shows an example of only the `--params` **residual** — the fields not already exposed as positional args or flags — instead of dumping the whole LSP message. For methods fully covered by args/flags (e.g. `hover`) it prints "no --params needed". The deepened codeAction flags (`--code-action-only`, `--code-action-trigger-kind`) already appear in the options list, so the example now reflects only what you actually pass as JSON (e.g. `context.diagnostics`). `--json` drill-down gains a matching `paramsExample` field.
