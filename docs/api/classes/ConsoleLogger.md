[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ConsoleLogger

# Class: ConsoleLogger

Defined in: [packages/core/src/utils/logger.ts:31](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/logger.ts#L31)

Console logger implementation

## Implements

- [`Logger`](../interfaces/Logger.md)

## Constructors

### Constructor

> **new ConsoleLogger**(`level?`): `ConsoleLogger`

Defined in: [packages/core/src/utils/logger.ts:32](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/logger.ts#L32)

#### Parameters

##### level?

[`LogLevel`](../enumerations/LogLevel.md) = `LogLevel.Info`

#### Returns

`ConsoleLogger`

## Methods

### debug()

> **debug**(`message`, ...`args`): `void`

Defined in: [packages/core/src/utils/logger.ts:52](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/logger.ts#L52)

#### Parameters

##### message

`string`

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`debug`](../interfaces/Logger.md#debug)

***

### error()

> **error**(`message`, ...`args`): `void`

Defined in: [packages/core/src/utils/logger.ts:34](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/logger.ts#L34)

#### Parameters

##### message

`string`

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`error`](../interfaces/Logger.md#error)

***

### info()

> **info**(`message`, ...`args`): `void`

Defined in: [packages/core/src/utils/logger.ts:46](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/logger.ts#L46)

#### Parameters

##### message

`string`

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`info`](../interfaces/Logger.md#info)

***

### trace()

> **trace**(`message`, ...`args`): `void`

Defined in: [packages/core/src/utils/logger.ts:58](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/logger.ts#L58)

#### Parameters

##### message

`string`

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`trace`](../interfaces/Logger.md#trace)

***

### warn()

> **warn**(`message`, ...`args`): `void`

Defined in: [packages/core/src/utils/logger.ts:40](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/logger.ts#L40)

#### Parameters

##### message

`string`

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`warn`](../interfaces/Logger.md#warn)
