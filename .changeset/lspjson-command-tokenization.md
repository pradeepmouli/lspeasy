---
"@lspeasy/core": minor
"@lsproxy/cli": patch
---

Fix `lsp.json` entries whose `command` field embeds the whole launch command (binary + flags, e.g. `"typescript-language-server --stdio"`) with no separate `args` array. `buildServerCommand` previously quoted that entire string as one token, so `spawn()` failed with `ENOENT` because no binary has a name containing a space. `entry.command` is now tokenized (via the existing `tokenizeCommand` utility) before being combined with `args` and re-quoted, so embedded flags correctly split into separate argv tokens.

- `@lspeasy/core`: `buildServerCommand` is now exported from `discover.ts` and re-exported from the package's public barrel, since `apps/cli` needed it to eliminate a duplicated copy of the same (buggy) logic.
- `@lsproxy/cli`: `apps/cli/src/resolve.ts`'s local `buildCommand` (a private mirror of core's function, kept in sync by hand) is removed; `platformServers()` now calls the shared, fixed `buildServerCommand` from `@lspeasy/core` directly. This closes the same bug for platform-adapter-sourced servers (Claude Code/Codex/Copilot-CLI configs), not just `lsp.json`-sourced ones.
