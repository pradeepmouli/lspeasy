[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / FoldingRangeClientCapabilities

# Interface: FoldingRangeClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.d.ts:5

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.d.ts:12

Whether implementation supports dynamic registration for folding range
providers. If this is set to `true` the client supports the new
`FoldingRangeRegistrationOptions` return value for the corresponding
server capability as well.

***

### foldingRange?

> `optional` **foldingRange?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.d.ts:44

Specific options for the folding range.

#### collapsedText?

> `optional` **collapsedText?**: `boolean`

If set, the client signals that it supports setting collapsedText on
folding ranges to display custom labels instead of the default text.

##### Since

3.17.0

#### Since

3.17.0

***

### foldingRangeKind?

> `optional` **foldingRangeKind?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.d.ts:30

Specific options for the folding range kind.

#### valueSet?

> `optional` **valueSet?**: `string`[]

The folding range kind values the client supports. When this
property exists the client also guarantees that it will
handle values outside its set gracefully and falls back
to a default value when unknown.

#### Since

3.17.0

***

### lineFoldingOnly?

> `optional` **lineFoldingOnly?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.d.ts:24

If set, the client signals that it only supports folding complete lines.
If set, client will ignore specified `startCharacter` and `endCharacter`
properties in a FoldingRange.

***

### rangeLimit?

> `optional` **rangeLimit?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.d.ts:18

The maximum number of folding ranges that the client prefers to receive
per document. The value serves as a hint, servers are free to follow the
limit.
