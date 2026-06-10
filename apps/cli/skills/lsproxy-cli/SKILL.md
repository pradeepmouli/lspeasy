---
name: lsproxy-cli
description: "`@lspeasy/cli` — programmatic entry point.

Exposes the reusable refactor internals (session pipeline + WorkspaceEdit
applier) so the same machinery can be embedded in scripts, not just invoked
through the `lspeasy` bin. Also: lsp, language-server-protocol, refactor, rename, codemod, move-symbol, cli."
license: MIT
---

# @lsproxy/cli

`@lspeasy/cli` — programmatic entry point.

Exposes the reusable refactor internals (session pipeline + WorkspaceEdit
applier) so the same machinery can be embedded in scripts, not just invoked
through the `lspeasy` bin.

## Quick Start

```
lsproxy <namespace> <command> [args] [flags]
lsproxy call <method> --params <json>
```

## Configuration

**SessionOptions** (6 options — see references/config.md)

## Quick Reference

**apply:** `applyWorkspaceEdit` (Apply a WorkspaceEdit to disk and return what was changed), `applyTextEdits` (Apply text edits to a string, splicing in reverse offset order so earlier
edits do not invalidate the offsets of later ones), `planWorkspaceEdit` (Normalize a WorkspaceEdit into an ordered list of changes without
touching disk), `WorkspaceEdit`, `LspTextEdit`, `LspRange`, `LspPosition`, `AppliedChange` (A single change the apply pipeline performed, for reporting / dry-run output)
**session:** `RefactorSession`
**io:** `GlobalFlags`

## References

Load these on demand — do NOT read all at once:

- When calling any function → read `references/functions.md` for full signatures, parameters, and return types
- When using a class → read `references/classes.md` for properties, methods, and inheritance
- When defining typed variables or function parameters → read `references/types.md`
- When configuring options → read `references/config.md` for all settings and defaults

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli <pmouli@mac.com> (https://github.com/pradeepmouli)