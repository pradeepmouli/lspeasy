[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SemanticTokensClientCapabilities

# Interface: SemanticTokensClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:24

## Since

3.16.0

## Properties

### augmentsSyntaxTokens?

> `optional` **augmentsSyntaxTokens?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:100

Whether the client uses semantic tokens to augment existing
syntax tokens. If set to `true` client side created syntax
tokens and semantic tokens are both used for colorization. If
set to `false` the client only uses the returned semantic tokens
for colorization.

If the value is `undefined` then the client behavior is not
specified.

#### Since

3.17.0

***

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:30

Whether implementation supports dynamic registration. If this is set to `true`
the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
return value for the corresponding server capability as well.

***

### formats

> **formats**: `"relative"`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:70

The token formats the clients supports.

***

### multilineTokenSupport?

> `optional` **multilineTokenSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:78

Whether the client supports tokens that can span multiple lines.

***

### overlappingTokenSupport?

> `optional` **overlappingTokenSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:74

Whether the client supports tokens that can overlap each other.

***

### requests

> **requests**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:41

Which requests the client supports and might send to the server
depending on the server's capability. Please note that clients might not
show semantic tokens or degrade some of the user experience if a range
or full request is advertised by the client but not provided by the
server. If for example the client capability `requests.full` and
`request.range` are both set to true but the server only provides a
range provider the client might not render a minimap correctly or might
even decide to not show any semantic tokens at all.

#### full?

> `optional` **full?**: `boolean` \| \{ `delta?`: `boolean`; \}

The client will send the `textDocument/semanticTokens/full` request if
the server provides a corresponding handler.

##### Union Members

`boolean`

***

###### Type Literal

\{ `delta?`: `boolean`; \}

###### delta?

> `optional` **delta?**: `boolean`

The client will send the `textDocument/semanticTokens/full/delta` request if
the server provides a corresponding handler.

#### range?

> `optional` **range?**: `boolean` \| \{ \}

The client will send the `textDocument/semanticTokens/range` request if
the server provides a corresponding handler.

***

### serverCancelSupport?

> `optional` **serverCancelSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:87

Whether the client allows the server to actively cancel a
semantic token request, e.g. supports returning
LSPErrorCodes.ServerCancelled. If a server does the client
needs to retrigger the request.

#### Since

3.17.0

***

### tokenModifiers

> **tokenModifiers**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:66

The token modifiers that the client supports.

***

### tokenTypes

> **tokenTypes**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:62

The token types that the client supports.
