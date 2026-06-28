---
'@lsproxy/cli': minor
'@lspeasy/core': minor
---

Multi-platform LSP config interop. `lsproxy config import|export|diff|list`
bridges lsproxy's lsp.json with Copilot CLI, Claude Code, and Codex
(read-only); VS Code is detected-but-unsupported. A local plugin resolver in
@lspeasy/core reads installed `.lsp.json` definitions to translate plugin
toggles to/from canonical servers. Richer `.lsp.json` fields are preserved
end-to-end. `--json` emits a stable contract at every command.
