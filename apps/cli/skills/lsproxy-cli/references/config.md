# Configuration

## SessionOptions

### Properties

#### serverCommand

Server launch command, e.g. `typescript-language-server --stdio`. Required unless `transport` is supplied.

**Type:** `string`

#### root

Absolute project root directory.

**Type:** `string`

**Required:** yes

#### languageId

languageId for textDocument/didOpen (e.g. 'typescript', 'rust').

**Type:** `string`

#### indexWaitMs

Milliseconds to wait for the server to index before the first request.

**Type:** `number`

#### verbose

Emit `[lsproxy] …` progress lines to stderr.

**Type:** `boolean`

#### transport

Pre-built transport to use instead of spawning a server process.

When supplied, `serverCommand` is ignored and no child process is spawned.
Used by the proxy path to reuse all downstream session logic unchanged.

**Type:** `Transport`