# Experimental native stdio bridge

This experiment keeps Unix-socket operations in a small Rust binary. A short-lived
`client` copies opaque bytes between stdin/stdout and a Unix socket. A persistent
`server` owns that socket and launches one daemon with a multiplexed stdin/stdout
channel, preserving its shared backend pool across CLI sessions.

Build explicitly; the default Node daemon and CLI do not use this path:

```sh
pnpm build
cargo build --release --manifest-path native/lsproxy-bridge/Cargo.toml \
  --features experimental-native-bridge
native/lsproxy-bridge/target/release/lsproxy-bridge server /tmp/lsproxy-bridge.sock \
  -- node apps/proxy/dist/bridge-main.js --root "$PWD"
```

To opt the CLI into the native relay for a project, set
`LSPROXY_BRIDGE_BIN` to the built binary's absolute path and use ordinary
`lsproxy` commands. The CLI starts the Rust server with the daemon and spawns
a short-lived Rust client for each connection. The client ends with its CLI
connection; the server exits when its daemon exits and removes the socket.

In another terminal, an LSP-speaking client can use
`native/lsproxy-bridge/target/release/lsproxy-bridge client /tmp/lsproxy-bridge.sock`
as its stdio peer. Keep its stdin open while requests are outstanding, then close
it as part of normal LSP shutdown. `client` is a byte relay; it does not parse JSON.

The daemon-side channel uses 9-byte headers: one kind byte (`DATA=1`, `OPEN=2`,
`CLOSE=3`, `INPUT_CLOSED=4`), a big-endian `u32` session ID, and a big-endian
`u32` payload length. Only `DATA` carries bytes, with a 16 MiB frame limit.
`INPUT_CLOSED` is directional so a response can still travel toward a client
after its sending side closes. The daemon's stdout is reserved for these frames;
diagnostics go to stderr. Output uses 16 KiB chunks and a bounded 64-frame
queue per session, so a stalled client cannot block another session's replies.
An input-closed session waits up to 60 seconds for outstanding responses before
being reaped. The bridge socket is created with mode `0600`.

This proves the transport topology with the current Node daemon. It does not
claim that the daemon or CLI are statically compiled by ScriptC: their remaining
compiler and dependency blockers are separate work. The Rust binary itself is
native and needs no Node process on the short-lived client side.
