---
"@lspeasy/core": minor
"@lsproxy/cli": minor
"@lsproxy/proxy": minor
---

Wire `lsp.json`'s `initializationOptions` field through to the real LSP `initialize` request, across both the CLI's direct-connect path and the proxy daemon's connect path. Previously this field was parsed and preserved on round-trip but silently ignored at runtime. Now a user can declare `"typescript": {"command": "...", "initializationOptions": {"supportsMoveToFileCodeAction": true}}` in their `lsp.json` and have it actually reach the server — for example, unlocking `typescript-language-server`'s deterministic, target-file-aware "Move to file" refactor code action instead of only the interactive "Move to a new file" variant. This is purely additive and backward-compatible: omitting the field changes nothing.
