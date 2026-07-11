---
"@lsproxy/cli": patch
---

Fix the "Capability options:" and "Discovering commands:" help footers (for capability-gated commands and `workspace executeCommand`, respectively) never actually appearing for users. Both were built with Commander's `addHelpText('after', ...)`, which only surfaces text through `outputHelp()`'s `afterHelp` event — but this CLI renders help by calling `helpInformation()` directly, bypassing that event entirely, so the footers were silently dropped. They now use the same `appendHelpFooter` helper already used for the global-options footer, which wraps `helpInformation()` directly and composes correctly across multiple calls.
