---
"@lsproxy/cli": patch
---

Retry `textDocument/references` while the result is still incomplete (empty or declaration-only) until the language server finishes loading the workspace project, within the existing `indexWait` budget. Turns a cold under-report into a correct result instead of just a warning; on timeout the best-effort result is returned (and still warned). Works in both proxy and `--no-proxy` modes since it gates at the result layer.
