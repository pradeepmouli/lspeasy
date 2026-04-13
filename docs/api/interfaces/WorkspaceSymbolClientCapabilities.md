[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceSymbolClientCapabilities

# Interface: WorkspaceSymbolClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2590

Client capabilities for a [WorkspaceSymbolRequest](../lspeasy/namespaces/WorkspaceSymbolRequest/README.md).

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2594

Symbol request supports dynamic registration.

***

### resolveSupport?

> `optional` **resolveSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2630

The client support partial workspace symbols. The client will send the
request `workspaceSymbol/resolve` to the server to resolve additional
properties.

#### properties

> **properties**: `string`[]

The properties that a client can resolve lazily. Usually
`location.range`

#### Since

3.17.0

***

### symbolKind?

> `optional` **symbolKind?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2598

Specific capabilities for the `SymbolKind` in the `workspace/symbol` request.

#### valueSet?

> `optional` **valueSet?**: [`SymbolKind`](../type-aliases/SymbolKind.md)[]

The symbol kind values the client supports. When this
property exists the client also guarantees that it will
handle values outside its set gracefully and falls back
to a default value when unknown.

If this property is not present the client only supports
the symbol kinds from `File` to `Array` as defined in
the initial version of the protocol.

***

### tagSupport?

> `optional` **tagSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2617

The client supports tags on `SymbolInformation`.
Clients supporting tags have to handle unknown tags gracefully.

#### valueSet

> **valueSet**: `1`[]

The tags supported by the client.

#### Since

3.16.0
