---
"@lspeasy/core": major
"@lspeasy/client": major
"@lspeasy/server": major
---

BREAKING CHANGE: Move Zod from peer dependency to optional dependency

- Upgraded Zod from v3 to v4
- Changed from `peerDependencies` to `optionalDependencies`
- Zod is now completely optional - install it only if you need schema validation
