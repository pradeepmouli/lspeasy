---
"@lsproxy/cli": minor
---

Runtime server discovery now falls back to detected config platforms (Claude Code plugins, Codex, …) when `lsp.json` has no matching entry. A language configured only in a platform's config — e.g. Rust via a Claude Code plugin — is now served directly by `lsproxy <lang> <cmd>` and `lsproxy --help <lang>`, and listed in the bare `lsproxy` discovery view, without first running `config import`. `lsp.json` still wins on overlap.
