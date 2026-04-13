[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RAL

# Interface: RAL

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/ral.d.ts:65

## Properties

### applicationJson

> `readonly` **applicationJson**: `object`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/ral.d.ts:46

#### decoder

> `readonly` **decoder**: [`ContentTypeDecoder`](../type-aliases/ContentTypeDecoder.md)

#### encoder

> `readonly` **encoder**: [`ContentTypeEncoder`](../type-aliases/ContentTypeEncoder.md)

***

### console

> `readonly` **console**: `object`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/ral.d.ts:53

#### error()

> **error**(`message?`, ...`optionalParams`): `void`

##### Parameters

###### message?

`any`

###### optionalParams

...`any`[]

##### Returns

`void`

#### info()

> **info**(`message?`, ...`optionalParams`): `void`

##### Parameters

###### message?

`any`

###### optionalParams

...`any`[]

##### Returns

`void`

#### log()

> **log**(`message?`, ...`optionalParams`): `void`

##### Parameters

###### message?

`any`

###### optionalParams

...`any`[]

##### Returns

`void`

#### warn()

> **warn**(`message?`, ...`optionalParams`): `void`

##### Parameters

###### message?

`any`

###### optionalParams

...`any`[]

##### Returns

`void`

***

### messageBuffer

> `readonly` **messageBuffer**: `object`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/ral.d.ts:50

#### create()

> **create**(`encoding`): `_MessageBuffer`

##### Parameters

###### encoding

`_MessageBufferEncoding`

##### Returns

`_MessageBuffer`

***

### timer

> `readonly` **timer**: `object`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/ral.d.ts:59

#### setImmediate()

> **setImmediate**(`callback`, ...`args`): `Disposable`

##### Parameters

###### callback

(...`args`) => `void`

###### args

...`any`[]

##### Returns

`Disposable`

#### setInterval()

> **setInterval**(`callback`, `ms`, ...`args`): `Disposable`

##### Parameters

###### callback

(...`args`) => `void`

###### ms

`number`

###### args

...`any`[]

##### Returns

`Disposable`

#### setTimeout()

> **setTimeout**(`callback`, `ms`, ...`args`): `Disposable`

##### Parameters

###### callback

(...`args`) => `void`

###### ms

`number`

###### args

...`any`[]

##### Returns

`Disposable`
