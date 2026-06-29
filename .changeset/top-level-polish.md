---
"@lsproxy/cli": patch
---

Polish the bare `lsproxy` discovery view: relabel the inactive daemon state from "down" (reads like a crash) to "not started — starts on first request", and colorize the view to match the rest of the help/config output (bold title + section headers, yellow status, cyan language names and drill-down commands, green/dim live stats). Color stays TTY-gated and absent under `--json`/pipes.
