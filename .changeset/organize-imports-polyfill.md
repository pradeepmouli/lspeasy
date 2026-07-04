---
"@lsproxy/polyfill": minor
---

Add an `organizeImports` polyfill that synthesizes a composite `source.organizeImports` code action from per-diagnostic import-related quickfixes, for LSP backends that support pull-diagnostics and quickfixes but never implement the dedicated batch action themselves. Uses a title-based heuristic (matching "import" in the backend's own quickfix titles) since there's no portable diagnostic code for "unused/missing import" across language servers.
