---
"@lsproxy/cli": patch
---

Name the generated skill `<namespace>-<package>` (`lsproxy-cli`) instead of the generic `cli`, so the postinstall-copied skill dir in `~/.claude/skills` is self-namespacing and cannot clobber an unrelated `cli` skill from another package.
