[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypedMiddlewareContext

# Interface: TypedMiddlewareContext\<M\>

Defined in: [packages/core/src/middleware/types.ts:45](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L45)

## Extends

- [`MiddlewareContext`](MiddlewareContext.md)

## Type Parameters

### M

`M` *extends* [`LSPMethod`](../type-aliases/LSPMethod.md)

## Properties

### direction

> **direction**: [`MiddlewareDirection`](../type-aliases/MiddlewareDirection.md)

Defined in: [packages/core/src/middleware/types.ts:25](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L25)

#### Inherited from

[`MiddlewareContext`](MiddlewareContext.md).[`direction`](MiddlewareContext.md#direction)

***

### message

> **message**: [`MiddlewareMessage`](../type-aliases/MiddlewareMessage.md)

Defined in: [packages/core/src/middleware/types.ts:28](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L28)

#### Inherited from

[`MiddlewareContext`](MiddlewareContext.md).[`message`](MiddlewareContext.md#message)

***

### messageType

> **messageType**: [`MiddlewareMessageType`](../type-aliases/MiddlewareMessageType.md)

Defined in: [packages/core/src/middleware/types.ts:26](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L26)

#### Inherited from

[`MiddlewareContext`](MiddlewareContext.md).[`messageType`](MiddlewareContext.md#messagetype)

***

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/middleware/types.ts:29](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L29)

#### Inherited from

[`MiddlewareContext`](MiddlewareContext.md).[`metadata`](MiddlewareContext.md#metadata)

***

### method

> **method**: `M`

Defined in: [packages/core/src/middleware/types.ts:46](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L46)

#### Overrides

[`MiddlewareContext`](MiddlewareContext.md).[`method`](MiddlewareContext.md#method)

***

### params

> **params**: [`TypedParams`](../type-aliases/TypedParams.md)\<`M`\>

Defined in: [packages/core/src/middleware/types.ts:47](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L47)

***

### result?

> `optional` **result?**: [`TypedResult`](../type-aliases/TypedResult.md)\<`M`\>

Defined in: [packages/core/src/middleware/types.ts:48](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L48)

***

### transport

> **transport**: `string`

Defined in: [packages/core/src/middleware/types.ts:30](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/middleware/types.ts#L30)

#### Inherited from

[`MiddlewareContext`](MiddlewareContext.md).[`transport`](MiddlewareContext.md#transport)
