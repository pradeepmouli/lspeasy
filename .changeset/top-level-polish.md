---
"@lsproxy/cli": patch
---

Polish the bare `lsproxy` discovery view: relabel the inactive daemon state from "down" (reads like a crash) to "not started — starts on first request", use emoji status glyphs (🟢 running · ⚪ cold · 🟡 degraded · ✅/❌ health), and colorize with a 24-bit truecolor Nord palette (cyan names/commands, green/yellow status, bold title + section headers, dim metadata) to match the rest of the help/config output. Color stays TTY-gated and ANSI-free under `--json`/pipes.
