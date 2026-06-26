---
"@lsproxy/cli": patch
---

fix(cli): `--params` now binds on namespace commands, and `workspace` file-operation methods (`willRenameFiles`/`willCreateFiles`/`willDeleteFiles`) derive a `didOpen` anchor from `--params files[].oldUri`. Previously the action mistook commander's `Command` for the options object (so every namespace command dropped `--params`), and no anchor was opened for workspace file-ops (empty TS program → `getEditsForFileRename` returned no edits). LSP-driven file renames now load the program and emit the import-rewrite edits.
