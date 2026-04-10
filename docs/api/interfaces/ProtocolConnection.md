[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ProtocolConnection

# Interface: ProtocolConnection

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:3

## Properties

### onClose

> **onClose**: [`Event`](Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:164

An event emitter firing when the connection got closed.

***

### onDispose

> **onDispose**: [`Event`](Event.md)\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:173

An event emitter firing when the connection got disposed.

***

### onError

> **onError**: [`Event`](Event.md)\<\[`Error`, `Message` \| `undefined`, `number` \| `undefined`\]\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:160

An event emitter firing when an error occurs on the connection.

***

### onUnhandledNotification

> **onUnhandledNotification**: [`Event`](Event.md)\<`NotificationMessage`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:169

An event emitter firing when the connection receives a notification that is not
handled.

## Methods

### dispose()

> **dispose**(): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:181

Actively disposes the connection.

#### Returns

`void`

***

### end()

> **end**(): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:177

Ends the connection.

#### Returns

`void`

***

### hasPendingResponse()

> **hasPendingResponse**(): `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:70

Returns true if the connection has a pending response.
Otherwise false is returned.

#### Returns

`boolean`

***

### listen()

> **listen**(): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:185

Turns the connection into listening mode

#### Returns

`void`

***

### onNotification()

#### Call Signature

> **onNotification**\<`RO`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:114

Installs a notification handler.

##### Type Parameters

###### RO

`RO`

##### Parameters

###### type

[`ProtocolNotificationType0`](../classes/ProtocolNotificationType0.md)\<`RO`\>

The notification type to install the handler for.

###### handler

[`NotificationHandler0`](NotificationHandler0.md)

The actual handler.

##### Returns

`Disposable`

A disposable to remove the handler.

#### Call Signature

> **onNotification**(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:115

##### Parameters

###### type

[`NotificationType0`](../classes/NotificationType0.md)

###### handler

[`NotificationHandler0`](NotificationHandler0.md)

##### Returns

`Disposable`

#### Call Signature

> **onNotification**\<`P`, `RO`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:123

Installs a notification handler.

##### Type Parameters

###### P

`P`

###### RO

`RO`

##### Parameters

###### type

[`ProtocolNotificationType`](../classes/ProtocolNotificationType.md)\<`P`, `RO`\>

The notification type to install the handler for.

###### handler

[`NotificationHandler`](NotificationHandler.md)\<`P`\>

The actual handler.

##### Returns

`Disposable`

A disposable to remove the handler.

#### Call Signature

> **onNotification**\<`P`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:124

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

> **onNotification**(`method`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:132

Installs a notification handler.

##### Parameters

###### method

`string`

###### handler

[`GenericNotificationHandler`](GenericNotificationHandler.md)

The actual handler.

##### Returns

`Disposable`

A disposable to remove the handler.

***

### onProgress()

> **onProgress**\<`P`\>(`type`, `token`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:140

Installs a progress handler for a given token.

#### Type Parameters

##### P

`P`

#### Parameters

##### type

[`ProgressType`](../classes/ProgressType.md)\<`P`\>

the progress type

##### token

`string` \| `number`

the token

##### handler

[`NotificationHandler`](NotificationHandler.md)\<`P`\>

the handler

#### Returns

`Disposable`

A disposable to remove the handler.

***

### onRequest()

#### Call Signature

> **onRequest**\<`R`, `PR`, `E`, `RO`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:47

Installs a request handler.

##### Type Parameters

###### R

`R`

###### PR

`PR`

###### E

`E`

###### RO

`RO`

##### Parameters

###### type

[`ProtocolRequestType0`](../classes/ProtocolRequestType0.md)\<`R`, `PR`, `E`, `RO`\>

The request type to install the handler for.

###### handler

[`RequestHandler0`](RequestHandler0.md)\<`R`, `E`\>

The actual handler.

##### Returns

`Disposable`

A disposable to remove the handler.

#### Call Signature

> **onRequest**\<`R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:48

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

> **onRequest**\<`P`, `R`, `PR`, `E`, `RO`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:56

Installs a request handler.

##### Type Parameters

###### P

`P`

###### R

`R`

###### PR

`PR`

###### E

`E`

###### RO

`RO`

##### Parameters

###### type

[`ProtocolRequestType`](../classes/ProtocolRequestType.md)\<`P`, `R`, `PR`, `E`, `RO`\>

The request type to install the handler for.

###### handler

[`RequestHandler`](RequestHandler.md)\<`P`, `R`, `E`\>

The actual handler.

##### Returns

`Disposable`

A disposable to remove the handler.

#### Call Signature

> **onRequest**\<`P`, `R`, `E`\>(`type`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:57

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

> **onRequest**\<`R`, `E`\>(`method`, `handler`): `Disposable`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:65

Installs a request handler.

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

The actual handler.

##### Returns

`Disposable`

A disposable to remove the handler.

***

### sendNotification()

#### Call Signature

> **sendNotification**(`type`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:78

Sends a notification.

##### Parameters

###### type

[`NotificationType0`](../classes/NotificationType0.md)

the notification's type to send.

##### Returns

`Promise`\<`void`\>

A promise that resolves when the notification is written to the
network layer.

#### Call Signature

> **sendNotification**\<`RO`\>(`type`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:79

##### Type Parameters

###### RO

`RO`

##### Parameters

###### type

[`ProtocolNotificationType0`](../classes/ProtocolNotificationType0.md)\<`RO`\>

##### Returns

`Promise`\<`void`\>

#### Call Signature

> **sendNotification**\<`P`, `RO`\>(`type`, `params?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:88

Sends a notification.

##### Type Parameters

###### P

`P`

###### RO

`RO`

##### Parameters

###### type

[`ProtocolNotificationType`](../classes/ProtocolNotificationType.md)\<`P`, `RO`\>

the notification's type to send.

###### params?

`P`

the notification's parameters.

##### Returns

`Promise`\<`void`\>

A promise that resolves when the notification is written to the
network layer.

#### Call Signature

> **sendNotification**\<`P`\>(`type`, `params?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:89

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

> **sendNotification**(`method`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:97

Sends a notification.

##### Parameters

###### method

`string`

the notification's method name.

##### Returns

`Promise`\<`void`\>

A promise that resolves when the notification is written to the
network layer.

#### Call Signature

> **sendNotification**(`method`, `params`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:106

Sends a notification.

##### Parameters

###### method

`string`

the notification's method name.

###### params

`any`

the notification's parameters.

##### Returns

`Promise`\<`void`\>

A promise that resolves when the notification is written to the
network layer.

***

### sendProgress()

> **sendProgress**\<`P`\>(`type`, `token`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:149

Sends progress.

#### Type Parameters

##### P

`P`

#### Parameters

##### type

[`ProgressType`](../classes/ProgressType.md)\<`P`\>

the progress type

##### token

`string` \| `number`

the token to use

##### value

`P`

the progress value

#### Returns

`Promise`\<`void`\>

A promise that resolves when the progress is written to the
network layer.

***

### sendRequest()

#### Call Signature

> **sendRequest**\<`R`, `PR`, `E`, `RO`\>(`type`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:11

Sends a request and returns a promise resolving to the result of the request.

##### Type Parameters

###### R

`R`

###### PR

`PR`

###### E

`E`

###### RO

`RO`

##### Parameters

###### type

[`ProtocolRequestType0`](../classes/ProtocolRequestType0.md)\<`R`, `PR`, `E`, `RO`\>

The type of request to sent.

###### token?

`CancellationToken`

An optional cancellation token.

##### Returns

`Promise`\<`R`\>

A promise resolving to the request's result.

#### Call Signature

> **sendRequest**\<`R`, `E`\>(`type`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:12

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

> **sendRequest**\<`P`, `R`, `PR`, `E`, `RO`\>(`type`, `params`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:21

Sends a request and returns a promise resolving to the result of the request.

##### Type Parameters

###### P

`P`

###### R

`R`

###### PR

`PR`

###### E

`E`

###### RO

`RO`

##### Parameters

###### type

[`ProtocolRequestType`](../classes/ProtocolRequestType.md)\<`P`, `R`, `PR`, `E`, `RO`\>

The type of request to sent.

###### params

`P`

The request's parameter.

###### token?

`CancellationToken`

An optional cancellation token.

##### Returns

`Promise`\<`R`\>

A promise resolving to the request's result.

#### Call Signature

> **sendRequest**\<`P`, `R`, `E`\>(`type`, `params`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:22

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

> **sendRequest**\<`R`\>(`method`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:30

Sends a request and returns a promise resolving to the result of the request.

##### Type Parameters

###### R

`R`

##### Parameters

###### method

`string`

the method name.

###### token?

`CancellationToken`

An optional cancellation token.

##### Returns

`Promise`\<`R`\>

A promise resolving to the request's result.

#### Call Signature

> **sendRequest**\<`R`\>(`method`, `param`, `token?`): `Promise`\<`R`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:39

Sends a request and returns a promise resolving to the result of the request.

##### Type Parameters

###### R

`R`

##### Parameters

###### method

`string`

the method name.

###### param

`any`

###### token?

`CancellationToken`

An optional cancellation token.

##### Returns

`Promise`\<`R`\>

A promise resolving to the request's result.

***

### trace()

#### Call Signature

> **trace**(`value`, `tracer`, `sendNotification?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:155

Enables tracing mode for the connection.

##### Parameters

###### value

[`Trace`](../enumerations/Trace.md)

###### tracer

[`Tracer`](Tracer.md)

###### sendNotification?

`boolean`

##### Returns

`Promise`\<`void`\>

A promise that resolves when the trace value is written to the
network layer.

#### Call Signature

> **trace**(`value`, `tracer`, `traceOptions?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/connection.d.ts:156

##### Parameters

###### value

[`Trace`](../enumerations/Trace.md)

###### tracer

[`Tracer`](Tracer.md)

###### traceOptions?

[`TraceOptions`](TraceOptions.md)

##### Returns

`Promise`\<`void`\>
