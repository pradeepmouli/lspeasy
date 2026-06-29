---
"@lsproxy/cli": patch
---

Polish the bare `lsproxy` discovery view: relabel the inactive daemon state from "down" (reads like a crash) to "not started — starts on first request", swap status glyphs to emoji (🟢 running · ⚪ cold · 🟡 degraded · ✅/❌ health), and colorize to match the rest of the help/config output (bold title + section headers, yellow status, cyan language names and drill-down commands, dim metadata). Color stays TTY-gated and ANSI-free under `--json`/pipes.
