---
"@lspeasy/client": patch
"@lspeasy/server": patch
---

Move `camelcase` from root devDependencies to package dependencies — it is imported at runtime by capability-proxy and was missing from installed packages
