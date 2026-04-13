[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeActionClientCapabilities

# Interface: CodeActionClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2458

The Client Capabilities of a [CodeActionRequest](../lspeasy/namespaces/CodeActionRequest/README.md).

## Properties

### codeActionLiteralSupport?

> `optional` **codeActionLiteralSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2470

The client support code action literals of type `CodeAction` as a valid
response of the `textDocument/codeAction` request. If the property is not
set the request can only return `Command` literals.

#### codeActionKind

> **codeActionKind**: `object`

The code action kind is support with the following value
set.

##### codeActionKind.valueSet

> **valueSet**: `string`[]

The code action kind values the client supports. When this
property exists the client also guarantees that it will
handle values outside its set gracefully and falls back
to a default value when unknown.

#### Since

3.8.0

***

### dataSupport?

> `optional` **dataSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2504

Whether code action supports the `data` property which is
preserved between a `textDocument/codeAction` and a
`codeAction/resolve` request.

#### Since

3.16.0

***

### disabledSupport?

> `optional` **disabledSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2496

Whether code action supports the `disabled` property.

#### Since

3.16.0

***

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2462

Whether code action supports dynamic registration.

***

### honorsChangeAnnotations?

> `optional` **honorsChangeAnnotations?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2526

Whether the client honors the change annotations in
text edits and resource operations returned via the
`CodeAction#edit` property by for example presenting
the workspace edit in the user interface and asking
for confirmation.

#### Since

3.16.0

***

### isPreferredSupport?

> `optional` **isPreferredSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2490

Whether code action supports the `isPreferred` property.

#### Since

3.15.0

***

### resolveSupport?

> `optional` **resolveSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2511

Whether the client supports resolving additional code action
properties via a separate `codeAction/resolve` request.

#### properties

> **properties**: `string`[]

The properties that a client can resolve lazily.

#### Since

3.16.0
