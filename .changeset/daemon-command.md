---
"@lsproxy/cli": minor
---

Add `lsproxy daemon <start|stop|status>` to manage the per-root proxy daemon explicitly (it otherwise starts lazily on first request). `start` spawns it (no-op if already running), `stop` SIGTERMs it, `status` prints the daemon line ("up · pid … · N backend(s) · M session(s)" or "not started"). All support `--json` (ANSI-free).
