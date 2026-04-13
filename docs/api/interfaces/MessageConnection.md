[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / MessageConnection

# Interface: MessageConnection

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:291

## Properties

### onClose

> **onClose**: [`Event`](Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:350

***

### onDispose

> **onDispose**: [`Event`](Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:353

***

### onError

> **onError**: [`Event`](Event.md)\<\[`Error`, `Message` \| `undefined`, `number` \| `undefined`\]\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:349

***

### onUnhandledNotification

> **onUnhandledNotification**: [`Event`](Event.md)\<`NotificationMessage`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:343

***

### onUnhandledProgress

> **onUnhandledProgress**: [`Event`](Event.md)\<`ProgressParams`\<`any`\>\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:346

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:354

#### Returns

`void`

***

### end()

> **end**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:352

#### Returns

`void`

***

### hasPendingResponse()

> **hasPendingResponse**(): `boolean`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:317

#### Returns

`boolean`

***

### inspect()

> **inspect**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:355

#### Returns

`void`

***

### listen()

> **listen**(): `void`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:351

#### Returns

`void`

***

### onNotification()

#### Call Signature

> **onNotification**(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:330

##### Parameters

###### type

[`NotificationType0`](../classes/NotificationType0.md)

###### handler

[`NotificationHandler0`](NotificationHandler0.md)

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:331

##### Type Parameters

###### P

`P`

##### Parameters

###### type

[`NotificationType`](../classes/NotificationType.md)\<`P`\>

###### handler

[`NotificationHandler`](NotificationHandler.md)\<`P`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:332

##### Type Parameters

###### P1

`P1`

##### Parameters

###### type

[`NotificationType1`](../classes/NotificationType1.md)\<`P1`\>

###### handler

[`NotificationHandler1`](NotificationHandler1.md)\<`P1`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:333

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

##### Parameters

###### type

[`NotificationType2`](../classes/NotificationType2.md)\<`P1`, `P2`\>

###### handler

[`NotificationHandler2`](NotificationHandler2.md)\<`P1`, `P2`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`, `P3`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:334

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

##### Parameters

###### type

[`NotificationType3`](../classes/NotificationType3.md)\<`P1`, `P2`, `P3`\>

###### handler

[`NotificationHandler3`](NotificationHandler3.md)\<`P1`, `P2`, `P3`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`, `P3`, `P4`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:335

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

##### Parameters

###### type

[`NotificationType4`](../classes/NotificationType4.md)\<`P1`, `P2`, `P3`, `P4`\>

###### handler

[`NotificationHandler4`](NotificationHandler4.md)\<`P1`, `P2`, `P3`, `P4`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:336

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

##### Parameters

###### type

[`NotificationType5`](../classes/NotificationType5.md)\<`P1`, `P2`, `P3`, `P4`, `P5`\>

###### handler

[`NotificationHandler5`](NotificationHandler5.md)\<`P1`, `P2`, `P3`, `P4`, `P5`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:337

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

##### Parameters

###### type

[`NotificationType6`](../classes/NotificationType6.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`\>

###### handler

[`NotificationHandler6`](NotificationHandler6.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:338

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

##### Parameters

###### type

[`NotificationType7`](../classes/NotificationType7.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`\>

###### handler

[`NotificationHandler7`](NotificationHandler7.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:339

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

##### Parameters

###### type

[`NotificationType8`](../classes/NotificationType8.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`\>

###### handler

[`NotificationHandler8`](NotificationHandler8.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:340

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

###### P9

`P9`

##### Parameters

###### type

[`NotificationType9`](../classes/NotificationType9.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`\>

###### handler

[`NotificationHandler9`](NotificationHandler9.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`\>

##### Returns

`Disposable`

#### Call Signature

> **onNotification**(`method`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:341

##### Parameters

###### method

`string`

###### handler

[`GenericNotificationHandler`](GenericNotificationHandler.md)

##### Returns

`Disposable`

#### Call Signature

> **onNotification**(`handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:342

##### Parameters

###### handler

[`StarNotificationHandler`](StarNotificationHandler.md)

##### Returns

`Disposable`

***

### onProgress()

> **onProgress**\<`P`\>(`type`, `token`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:344

#### Type Parameters

##### P

`P`

#### Parameters

##### type

[`ProgressType`](../classes/ProgressType.md)\<`P`\>

##### token

`string` \| `number`

##### handler

[`NotificationHandler`](NotificationHandler.md)\<`P`\>

#### Returns

`Disposable`

***

### onRequest()

#### Call Signature

> **onRequest**\<`R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:304

##### Type Parameters

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType0`](../classes/RequestType0.md)\<`R`, `E`\>

###### handler

[`RequestHandler0`](RequestHandler0.md)\<`R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:305

##### Type Parameters

###### P

`P`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType`](../classes/RequestType.md)\<`P`, `R`, `E`\>

###### handler

[`RequestHandler`](RequestHandler.md)\<`P`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:306

##### Type Parameters

###### P1

`P1`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType1`](../classes/RequestType1.md)\<`P1`, `R`, `E`\>

###### handler

[`RequestHandler1`](RequestHandler1.md)\<`P1`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:307

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType2`](../classes/RequestType2.md)\<`P1`, `P2`, `R`, `E`\>

###### handler

[`RequestHandler2`](RequestHandler2.md)\<`P1`, `P2`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `P3`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:308

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType3`](../classes/RequestType3.md)\<`P1`, `P2`, `P3`, `R`, `E`\>

###### handler

[`RequestHandler3`](RequestHandler3.md)\<`P1`, `P2`, `P3`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:309

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType4`](../classes/RequestType4.md)\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>

###### handler

[`RequestHandler4`](RequestHandler4.md)\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:310

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType5`](../classes/RequestType5.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `R`, `E`\>

###### handler

[`RequestHandler5`](RequestHandler5.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:311

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType6`](../classes/RequestType6.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `R`, `E`\>

###### handler

[`RequestHandler6`](RequestHandler6.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:312

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType7`](../classes/RequestType7.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `R`, `E`\>

###### handler

[`RequestHandler7`](RequestHandler7.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:313

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType8`](../classes/RequestType8.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `R`, `E`\>

###### handler

[`RequestHandler8`](RequestHandler8.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:314

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

###### P9

`P9`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType9`](../classes/RequestType9.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`, `R`, `E`\>

###### handler

[`RequestHandler9`](RequestHandler9.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`, `R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**\<`R`, `E`\>(`method`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:315

##### Type Parameters

###### R

`R`

###### E

`E`

##### Parameters

###### method

`string`

###### handler

[`GenericRequestHandler`](GenericRequestHandler.md)\<`R`, `E`\>

##### Returns

`Disposable`

#### Call Signature

> **onRequest**(`handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:316

##### Parameters

###### handler

[`StarRequestHandler`](StarRequestHandler.md)

##### Returns

`Disposable`

***

### sendNotification()

#### Call Signature

> **sendNotification**(`type`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:318

##### Parameters

###### type

[`NotificationType0`](../classes/NotificationType0.md)

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P`\>(`type`, `params?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:319

##### Type Parameters

###### P

`P`

##### Parameters

###### type

[`NotificationType`](../classes/NotificationType.md)\<`P`\>

###### params?

`P`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`\>(`type`, `p1`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:320

##### Type Parameters

###### P1

`P1`

##### Parameters

###### type

[`NotificationType1`](../classes/NotificationType1.md)\<`P1`\>

###### p1

`P1`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`\>(`type`, `p1`, `p2`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:321

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

##### Parameters

###### type

[`NotificationType2`](../classes/NotificationType2.md)\<`P1`, `P2`\>

###### p1

`P1`

###### p2

`P2`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`, `P3`\>(`type`, `p1`, `p2`, `p3`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:322

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

##### Parameters

###### type

[`NotificationType3`](../classes/NotificationType3.md)\<`P1`, `P2`, `P3`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`, `P3`, `P4`\>(`type`, `p1`, `p2`, `p3`, `p4`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:323

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

##### Parameters

###### type

[`NotificationType4`](../classes/NotificationType4.md)\<`P1`, `P2`, `P3`, `P4`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:324

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

##### Parameters

###### type

[`NotificationType5`](../classes/NotificationType5.md)\<`P1`, `P2`, `P3`, `P4`, `P5`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:325

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

##### Parameters

###### type

[`NotificationType6`](../classes/NotificationType6.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `p7`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:326

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

##### Parameters

###### type

[`NotificationType7`](../classes/NotificationType7.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

###### p7

`P7`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `p7`, `p8`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:327

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

##### Parameters

###### type

[`NotificationType8`](../classes/NotificationType8.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

###### p7

`P7`

###### p8

`P8`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `p7`, `p8`, `p9`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:328

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

###### P9

`P9`

##### Parameters

###### type

[`NotificationType9`](../classes/NotificationType9.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

###### p7

`P7`

###### p8

`P8`

###### p9

`P9`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**(`method`, `r0?`, ...`rest`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:329

##### Parameters

###### method

`string`

###### r0?

`any`

###### rest

...`any`[]

##### Returns

`Promise`\<`void`\>

***

### sendProgress()

> **sendProgress**\<`P`\>(`type`, `token`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:345

#### Type Parameters

##### P

`P`

#### Parameters

##### type

[`ProgressType`](../classes/ProgressType.md)\<`P`\>

##### token

`string` \| `number`

##### value

`P`

#### Returns

`Promise`\<`void`\>

***

### sendRequest()

#### Call Signature

> **sendRequest**\<`R`, `E`\>(`type`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:292

##### Type Parameters

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType0`](../classes/RequestType0.md)\<`R`, `E`\>

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P`, `R`, `E`\>(`type`, `params`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:293

##### Type Parameters

###### P

`P`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType`](../classes/RequestType.md)\<`P`, `R`, `E`\>

###### params

`P`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `R`, `E`\>(`type`, `p1`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:294

##### Type Parameters

###### P1

`P1`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType1`](../classes/RequestType1.md)\<`P1`, `R`, `E`\>

###### p1

`P1`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `R`, `E`\>(`type`, `p1`, `p2`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:295

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType2`](../classes/RequestType2.md)\<`P1`, `P2`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `P3`, `R`, `E`\>(`type`, `p1`, `p2`, `p3`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:296

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType3`](../classes/RequestType3.md)\<`P1`, `P2`, `P3`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>(`type`, `p1`, `p2`, `p3`, `p4`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:297

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType4`](../classes/RequestType4.md)\<`P1`, `P2`, `P3`, `P4`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `R`, `E`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:298

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType5`](../classes/RequestType5.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `R`, `E`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:299

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType6`](../classes/RequestType6.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `R`, `E`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `p7`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:300

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType7`](../classes/RequestType7.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

###### p7

`P7`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `R`, `E`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `p7`, `p8`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:301

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType8`](../classes/RequestType8.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

###### p7

`P7`

###### p8

`P8`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`, `R`, `E`\>(`type`, `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `p7`, `p8`, `p9`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:302

##### Type Parameters

###### P1

`P1`

###### P2

`P2`

###### P3

`P3`

###### P4

`P4`

###### P5

`P5`

###### P6

`P6`

###### P7

`P7`

###### P8

`P8`

###### P9

`P9`

###### R

`R`

###### E

`E`

##### Parameters

###### type

[`RequestType9`](../classes/RequestType9.md)\<`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`, `R`, `E`\>

###### p1

`P1`

###### p2

`P2`

###### p3

`P3`

###### p4

`P4`

###### p5

`P5`

###### p6

`P6`

###### p7

`P7`

###### p8

`P8`

###### p9

`P9`

###### token?

`CancellationToken`

##### Returns

`Promise`\<`R`\>

#### Call Signature

> **sendRequest**\<`R`\>(`method`, `r0?`, ...`rest`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:303

##### Type Parameters

###### R

`R`

##### Parameters

###### method

`string`

###### r0?

`any`

###### rest

...`any`[]

##### Returns

`Promise`\<`R`\>

***

### trace()

#### Call Signature

> **trace**(`value`, `tracer`, `sendNotification?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:347

##### Parameters

###### value

[`Trace`](../enumerations/Trace.md)

###### tracer

[`Tracer`](Tracer.md)

###### sendNotification?

`boolean`

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **trace**(`value`, `tracer`, `traceOptions?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-jsonrpc@8.2.0/node\_modules/vscode-jsonrpc/lib/common/connection.d.ts:348

##### Parameters

###### value

[`Trace`](../enumerations/Trace.md)

###### tracer

[`Tracer`](Tracer.md)

###### traceOptions?

[`TraceOptions`](TraceOptions.md)

##### Returns

`Promise`\<`void`\>
