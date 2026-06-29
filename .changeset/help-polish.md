---
"@lsproxy/cli": minor
---

Polish the help surfaces: the bare `lsproxy` view now shows a **Usage** line and a **Commands** section listing the non-namespace commands (`config`, `daemon`, `call`, `--version`) with descriptions — not just the per-language drill-down hints. The drill-down (`--help <lang> <ns> <request>`) now **colorizes Commander's own help** (usage, section titles, option/argument/subcommand terms) to match the rest of the output (TTY-gated, ANSI-free under `--json`/pipes). `workspace/executeCommand` help gains a note that command names come from capabilities and argument shapes from codeAction/codeLens results.
