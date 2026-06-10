---
"@lsproxy/cli": patch
---

fix(cli): capture proxy daemon output to a log and surface it on startup timeout

`spawnDaemon` previously ran the detached proxy daemon with `stdio: 'ignore'`, so a
fatal startup error (e.g. an unresolved runtime dependency) was discarded and surfaced
only as a generic "Proxy daemon did not start within 5000ms" timeout — undiagnosable
from the CLI. The daemon now logs stdout/stderr to `~/.lsproxy/daemon-<socket>.log`,
and `pollForSocket` includes a tail of that log in the timeout error, so daemon
startup crashes are diagnosable instead of silent.
