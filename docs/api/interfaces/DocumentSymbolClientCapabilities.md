[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentSymbolClientCapabilities

# Interface: DocumentSymbolClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2371

Client Capabilities for a [DocumentSymbolRequest](../lspeasy/namespaces/DocumentSymbolRequest/README.md).

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2375

Whether document symbol supports dynamic registration.

***

### hierarchicalDocumentSymbolSupport?

> `optional` **hierarchicalDocumentSymbolSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2396

The client supports hierarchical document symbols.

***

### labelSupport?

> `optional` **labelSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2416

The client supports an additional label presented in the UI when
registering a document symbol provider.

#### Since

3.16.0

***

### symbolKind?

> `optional` **symbolKind?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2380

Specific capabilities for the `SymbolKind` in the
`textDocument/documentSymbol` request.

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

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2404

The client supports tags on `SymbolInformation`. Tags are supported on
`DocumentSymbol` if `hierarchicalDocumentSymbolSupport` is set to true.
Clients supporting tags have to handle unknown tags gracefully.

#### valueSet

> **valueSet**: `1`[]

The tags supported by the client.

#### Since

3.16.0
