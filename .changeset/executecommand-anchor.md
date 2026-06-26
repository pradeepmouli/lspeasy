---
"@lsproxy/cli": patch
---

fix(cli): anchor `workspace/executeCommand` on the refactor's source file. Refactor commands (e.g. `_typescript.applyRefactoring` "Move to file") carry their file as a plain path in `arguments[0].file`, not a positional or `textDocument.uri` — so the session never opened a document and the TS server threw "No Project". Mine `arguments[0].file` for the anchor too, so LSP refactors (move-symbol-to-file) work headlessly.
