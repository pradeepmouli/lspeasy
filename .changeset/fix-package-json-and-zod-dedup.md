---
"@lspeasy/core": patch
"@lspeasy/client": patch
"@lspeasy/server": patch
---

Fix trailing comma in core package.json that caused ERR_PNPM_JSON_PARSE on install; remove duplicate zod devDependency entry that shadowed the optionalDependency range.
