---
"@lsproxy/cli": patch
---

Polish the colorized surfaces (bare `lsproxy` discovery view and `lsproxy config list`): relabel the inactive daemon state from "down" (reads like a crash) to "not started — starts on first request", use emoji status glyphs (🟢 running/detected · ⚪ cold/absent · 🟡 degraded · ✅/❌ health), and colorize with a 24-bit truecolor Nord palette (cyan names/ids/commands, green/yellow status, bold title + section headers, dim metadata). Color stays TTY-gated and ANSI-free under `--json`/pipes.
