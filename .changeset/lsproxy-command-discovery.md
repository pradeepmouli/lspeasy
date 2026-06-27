---
'@lsproxy/cli': minor
'@lsproxy/proxy': minor
'@lspeasy/core': minor
---

Dynamic, capability-aware command discovery for `lsproxy`. Bare `lsproxy` lists
configured languages with live health/stats from a new `$/lsproxy.status` proxy
control message; `lsproxy --help <language> <namespace> <request>` drills down
through capability-filtered namespaces to parameter schemas. `--json` emits a
stable, ANSI-free status/command contract for agent invocation.
