[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CallHierarchyRegistrationOptions

# Interface: CallHierarchyRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.d.ts:28

Call hierarchy options used during static or dynamic registration.

## Since

3.16.0

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`CallHierarchyOptions`](CallHierarchyOptions.md).[`StaticRegistrationOptions`](StaticRegistrationOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### id?

> `optional` **id?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:755

The id used to register the request. The id can be used to deregister
the request again. See also Registration#id.

#### Inherited from

[`StaticRegistrationOptions`](StaticRegistrationOptions.md).[`id`](StaticRegistrationOptions.md#id)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`CallHierarchyOptions`](CallHierarchyOptions.md).[`workDoneProgress`](CallHierarchyOptions.md#workdoneprogress)
