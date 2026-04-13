[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / GeneralClientCapabilities

# Interface: GeneralClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:645

General client capabilities.

## Since

3.16.0

## Properties

### markdown?

> `optional` **markdown?**: [`MarkdownClientCapabilities`](MarkdownClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:677

Client capabilities specific to the client's markdown parser.

#### Since

3.16.0

***

### positionEncodings?

> `optional` **positionEncodings?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:698

The position encodings supported by the client. Client and server
have to agree on the same position encoding to ensure that offsets
(e.g. character position in a line) are interpreted the same on both
sides.

To keep the protocol backwards compatible the following applies: if
the value 'utf-16' is missing from the array of position encodings
servers can assume that the client supports UTF-16. UTF-16 is
therefore a mandatory encoding.

If omitted it defaults to ['utf-16'].

Implementation considerations: since the conversion from one encoding
into another requires the content of the file / line the conversion
is best done where the file is read which is usually on the server
side.

#### Since

3.17.0

***

### regularExpressions?

> `optional` **regularExpressions?**: [`RegularExpressionsClientCapabilities`](RegularExpressionsClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:671

Client capabilities specific to regular expressions.

#### Since

3.16.0

***

### staleRequestSupport?

> `optional` **staleRequestSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:654

Client capability that signals how the client
handles stale requests (e.g. a request
for which the client will not process the response
anymore since the information is outdated).

#### cancel

> **cancel**: `boolean`

The client will actively cancel the request.

#### retryOnContentModified

> **retryOnContentModified**: `string`[]

The list of requests for which the client
will retry the request if it receives a
response with error code `ContentModified`

#### Since

3.17.0
