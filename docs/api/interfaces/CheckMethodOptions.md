[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CheckMethodOptions

# Interface: CheckMethodOptions

Defined in: [packages/core/src/utils/capability-guard.ts:43](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L43)

## Properties

### actionLabel

> **actionLabel**: `string`

Defined in: [packages/core/src/utils/capability-guard.ts:48](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L48)

***

### capabilityLabel

> **capabilityLabel**: `string`

Defined in: [packages/core/src/utils/capability-guard.ts:49](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L49)

***

### getCapabilityKey

> **getCapabilityKey**: (`method`) => `string` \| `null` \| `undefined`

Defined in: [packages/core/src/utils/capability-guard.ts:46](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L46)

#### Parameters

##### method

`string`

#### Returns

`string` \| `null` \| `undefined`

***

### hasCapability

> **hasCapability**: (`key`) => `boolean`

Defined in: [packages/core/src/utils/capability-guard.ts:47](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L47)

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### logger

> **logger**: [`Logger`](Logger.md)

Defined in: [packages/core/src/utils/capability-guard.ts:50](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L50)

***

### method

> **method**: `string`

Defined in: [packages/core/src/utils/capability-guard.ts:44](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L44)

***

### methodSets

> **methodSets**: `object`

Defined in: [packages/core/src/utils/capability-guard.ts:45](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L45)

#### all

> **all**: `Set`\<`string`\>

#### alwaysAllowed

> **alwaysAllowed**: `Set`\<`string`\>

***

### strict

> **strict**: `boolean`

Defined in: [packages/core/src/utils/capability-guard.ts:51](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/capability-guard.ts#L51)
