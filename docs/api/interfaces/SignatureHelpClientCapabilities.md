[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SignatureHelpClientCapabilities

# Interface: SignatureHelpClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2120

Client Capabilities for a [SignatureHelpRequest](../lspeasy/namespaces/SignatureHelpRequest/README.md).

## Properties

### contextSupport?

> `optional` **contextSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2163

The client supports to send additional context information for a
`textDocument/signatureHelp` request. A client that opts into
contextSupport will also support the `retriggerCharacters` on
`SignatureHelpOptions`.

#### Since

3.15.0

***

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2124

Whether signature help supports dynamic registration.

***

### signatureInformation?

> `optional` **signatureInformation?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2129

The client supports the following `SignatureInformation`
specific properties.

#### activeParameterSupport?

> `optional` **activeParameterSupport?**: `boolean`

The client supports the `activeParameter` property on `SignatureInformation`
literal.

##### Since

3.16.0

#### documentationFormat?

> `optional` **documentationFormat?**: [`MarkupKind`](../type-aliases/MarkupKind.md)[]

Client supports the following content formats for the documentation
property. The order describes the preferred format of the client.

#### parameterInformation?

> `optional` **parameterInformation?**: `object`

Client capabilities specific to parameter information.

##### parameterInformation.labelOffsetSupport?

> `optional` **labelOffsetSupport?**: `boolean`

The client supports processing label offsets instead of a
simple label string.

###### Since

3.14.0
