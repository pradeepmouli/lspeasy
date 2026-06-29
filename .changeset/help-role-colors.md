---
"@lsproxy/cli": minor
---

Apply the role-color scheme consistently across every help surface, not just
the drill-down. Namespaces are cyan, methods/requests blue, positional args
teal, and options/flags magenta — and now the same role reads the same color
everywhere. The bare `lsproxy` view colorizes its **Usage**, **Commands**, and
**Drill-down** terms by role (so the Usage line doubles as a legend), matching
the colors Commander emits in the per-request drill-down help. TTY-gated and
ANSI-free under `--json`/pipes.
