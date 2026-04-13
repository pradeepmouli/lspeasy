[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ColorPresentationParams

# Interface: ColorPresentationParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.d.ts:41

Parameters for a [ColorPresentationRequest](../lspeasy/namespaces/ColorPresentationRequest/README.md).

## Extends

- [`WorkDoneProgressParams`](WorkDoneProgressParams.md).`PartialResultParams`

## Properties

### color

> **color**: [`Color`](Color.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.d.ts:49

The color to request presentations for.

***

### partialResultToken?

> `optional` **partialResultToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:234

An optional token that a server can use to report partial results (e.g. streaming) to
the client.

#### Inherited from

`PartialResultParams.partialResultToken`

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.d.ts:53

The range where the color would be inserted. Serves as a context.

***

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.d.ts:45

The text document.

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
