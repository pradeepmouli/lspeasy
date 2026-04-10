[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RequestMessage

# Interface: RequestMessage

Defined in: [packages/core/src/jsonrpc/messages.ts:16](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/jsonrpc/messages.ts#L16)

JSON-RPC 2.0 Request Message

## Extends

- [`BaseMessage`](BaseMessage.md)

## Properties

### id

> **id**: `string` \| `number`

Defined in: [packages/core/src/jsonrpc/messages.ts:17](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/jsonrpc/messages.ts#L17)

***

### jsonrpc

> **jsonrpc**: `"2.0"`

Defined in: [packages/core/src/jsonrpc/messages.ts:10](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/jsonrpc/messages.ts#L10)

#### Inherited from

[`BaseMessage`](BaseMessage.md).[`jsonrpc`](BaseMessage.md#jsonrpc)

***

### method

> **method**: `string`

Defined in: [packages/core/src/jsonrpc/messages.ts:18](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/jsonrpc/messages.ts#L18)

***

### params?

> `optional` **params?**: `unknown`

Defined in: [packages/core/src/jsonrpc/messages.ts:19](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/jsonrpc/messages.ts#L19)
