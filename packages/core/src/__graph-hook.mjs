/**
 * Module-load reporter for the barrel-purity tests.
 *
 * Node exposes no stable API for inspecting an ESM graph after the fact, so
 * these tests register this hook and read back every URL the loader touched.
 * Not shipped: it lives outside the TypeScript build and is only ever
 * `register()`ed by a test's child process.
 */
let port;

export function initialize(data) {
  port = data.port;
}

export async function load(url, context, nextLoad) {
  port?.postMessage(url);
  return nextLoad(url, context);
}
