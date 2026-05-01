/**
 * Capability-conditional method types
 *
 * These types transform LSPRequest and LSPNotification into strongly-typed
 * method interfaces that are conditionally visible based on declared capabilities.
 */

import type { ServerCapabilities, ClientCapabilities } from './types.js';
import { LSPRequest, LSPNotification } from './namespaces.js';
import type {
  CamelCase,
  ConditionalKeys,
  ConditionalPick,
  ConditionalPickDeep,
  KeyAsString,
  PascalCase,
  Paths,
  Simplify,
  SimplifyDeep
} from 'type-fest';

/**
 * Helper type to check if a capability is enabled
 */
type IsServerCapabilityEnabled<Caps, A = Record<string, any>> = A extends {
  ServerCapability: infer Cap;
}
  ? Cap extends Paths<Caps>
    ? true
    : false
  : true /* No capability required */;

type IsClientCapabilityEnabled<Caps, A = Record<string, any>> = A extends {
  ClientCapability: infer Cap;
}
  ? Cap extends Paths<Caps>
    ? true
    : false
  : true /* No capability required */;

type StripNamespaceSuffix<
  Namespace extends string,
  Method extends string
> = Method extends `${infer Prefix}${Namespace}` ? Prefix : Method;
/**
 * Transform a request type definition into a method signature
 * Only included if the server capability is enabled
 */
type TransformToClientSendMethod<T, ServerCaps> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  Direction: 'clientToServer' | 'both';
}
  ? IsServerCapabilityEnabled<ServerCaps, T> extends false
    ? never
    : (params: P) => Promise<R>
  : never;

/**
 * Transform a request type definition into a server handler registration
 */
type TransformToServerHandler<T, ServerCaps> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  Direction: 'clientToServer' | 'both';
}
  ? IsServerCapabilityEnabled<ServerCaps, T> extends false
    ? never
    : (handler: (params: P) => Promise<R> | R) => void
  : never;

/**
 * Transform a request type definition into a server sending method
 */
type TransformToServerSendMethod<T, ClientCaps> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  Direction: 'serverToClient' | 'both';
}
  ? IsClientCapabilityEnabled<ClientCaps, T> extends false
    ? never
    : (params: P) => Promise<R>
  : never;

/**
 * Transform a request type definition into a client handler registration
 */
type TransformToClientHandler<T, ClientCaps> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  Direction: 'serverToClient' | 'both';
}
  ? IsClientCapabilityEnabled<ClientCaps, T> extends false
    ? never
    : (handler: (params: P) => Promise<R> | R) => void
  : never;

/**
 * Remove 'never' properties from an object type
 */
type RemoveNever<T> = Simplify<{
  [K in keyof T as T[K] extends never ? never : keyof T[K] extends never ? never : K]: T[K];
}>;

/**
 * Remove 'never' properties from nested namespace objects
 */
type RemoveNeverFromNamespace<T> = Simplify<{
  [K in keyof T as T[K] extends never ? never : K]: T[K];
}>;

/**
 * Client methods for sending requests to server
 * Methods are conditionally visible based on ServerCapabilities
 *
 * @example
 * type MyCaps = { hoverProvider: true; completionProvider: { triggerCharacters: ['.'] } };
 * type MyMethods = ClientSendMethods<MyCaps>;
 * // MyMethods.textDocument.hover is available
 * // MyMethods.textDocument.completion is available
 * // MyMethods.textDocument.definition is 'never' (not in capabilities)
 */
export type ClientNotifications<ServerCaps extends Partial<ServerCapabilities>> = Simplify<
  RemoveNever<{
    [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{
      [Method in ConditionalKeys<
        LSPRequest[Namespace],
        { Direction: 'clientToServer' | 'both' }
      > as CamelCase<Method>]: TransformToClientSendMethod<
        LSPRequest[Namespace][Method],
        ServerCaps
      >;
    }>;
  }>
>;

/**
 * Typed namespace of client-to-server LSP request methods, filtered by the
 * server's declared capabilities.
 *
 * @typeParam ServerCaps - The server capabilities shape.
 */
export type ClientRequests<ServerCaps extends Partial<ServerCapabilities>> = Simplify<
  RemoveNever<{
    [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{
      [Method in ConditionalKeys<
        LSPRequest[Namespace],
        { Direction: 'clientToServer' | 'both' }
      > as CamelCase<Method>]: TransformToClientSendMethod<
        LSPRequest[Namespace][Method],
        ServerCaps
      >;
    }>;
  }>
>;

/**
 * Server handler registration methods (for requests from client)
 * Handlers are conditionally visible based on ServerCapabilities
 *
 * @example
 * type MyCaps = { hoverProvider: true };
 * type MyHandlers = ServerHandlers<MyCaps>;
 * // MyHandlers.textDocument.onHover is available
 * // MyHandlers.textDocument.onCompletion is removed
 */
export type ServerHandlers<ServerCaps extends Partial<ServerCapabilities>> = Simplify<
  RemoveNever<{
    [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{
      [Method in keyof LSPRequest[Namespace] as `on${Method & string}`]: TransformToServerHandler<
        LSPRequest[Namespace][Method],
        ServerCaps
      >;
    }>;
  }>
>;

/**
 * Server methods for sending requests to client
 *
 * @example
 * type MyMethods = ServerSendMethods<ClientCapabilities>;
 * // MyMethods.window.showMessageRequest(params)
 * // MyMethods.workspace.applyWorkspaceEdit(params)
 */

/**
 * Client handler registration methods (for requests from server)
 *
 * @example
 * type MyHandlers = ClientHandlers<ClientCapabilities>;
 * // client.onShowMessageRequest(handler)
 * // client.onApplyWorkspaceEdit(handler)
 */
export type ClientRequestHandlers<_ClientCaps extends Partial<ClientCapabilities>> = RemoveNever<{
  [Namespace in keyof LSPRequest as CamelCase<Namespace>]: {
    [Method in keyof ConditionalPick<
      LSPRequest[Namespace],
      { Direction: 'serverToClient' | 'both' }
    > as `on${Method & string}Request`]: TransformToClientHandler<
      LSPRequest[Namespace][Method & keyof LSPRequest[Namespace]],
      _ClientCaps
    >;
  };
}>;

/**
 * Typed namespace of server-to-client notification handler registration methods,
 * filtered by the client's declared capabilities.
 *
 * @typeParam _ClientCaps - The client capabilities shape.
 */
export type ClientNotificationHandlers<_ClientCaps extends Partial<ClientCapabilities>> =
  RemoveNever<{
    [Namespace in keyof LSPNotification as CamelCase<Namespace>]: {
      [Method in keyof ConditionalPick<
        LSPNotification[Namespace],
        { Direction: 'serverToClient' | 'both' }
      > as `on${Method & string}Notification`]: TransformToClientHandler<
        LSPNotification[Namespace][Method & keyof LSPNotification[Namespace]],
        _ClientCaps
      >;
    };
  }>;

/**
 * Typed namespace of server-to-client request send methods, filtered by the
 * client's declared capabilities.
 *
 * @typeParam _ClientCaps - The client capabilities shape.
 */
export type ServerSendMethods<
  _ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities
> = Simplify<{
  [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNever<{
    [Method in keyof LSPRequest[Namespace] as CamelCase<
      Method & string
    >]: TransformToServerSendMethod<LSPRequest[Namespace][Method], _ClientCaps>;
  }>;
}>;

/**
 * Converts an LSP request type definition into a callable method signature
 * `(params: P) => Promise<R>`.
 */
export type ToRequestSignature<T> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
}
  ? (params: P) => Promise<R>
  : never;

/**
 * Converts an LSP notification type definition into a fire-and-forget method
 * signature `(params: P) => void`.
 */
export type ToNotificationSignature<T> = T extends {
  Method: string;
  Params: infer P;
}
  ? (params: P) => void
  : never;

/**
 * Converts an LSP request type definition into a handler registration signature
 * `(handler: (params: P) => Promise<R> | R) => void`.
 */
export type ToRequestHandlerSignature<T> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
}
  ? (handler: (params: P) => Promise<R> | R) => void
  : never;

/**
 * Converts an LSP notification type definition into a handler registration
 * signature `(handler: (params: P) => void) => void`.
 */
export type ToNotificationHandlerSignature<T> = T extends {
  Method: string;
  Params: infer P;
}
  ? (handler: (params: P) => void) => void
  : never;

export namespace Client {
  /** Mapped type of all available LSP request methods and their handler signatures */
  export type AvailableRequests<
    ClientCaps extends Partial<ClientCapabilities>,
    Requests extends Partial<LSPRequest> = LSPRequest
  > = Simplify<
    RemoveNever<{
      [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{
        [Method in keyof Requests[Namespace] as CamelCase<
          Method & string
        >]: IsClientCapabilityEnabled<ClientCaps, Requests[Namespace][Method]> extends true
          ? Requests[Namespace][Method]
          : never;
      }>;
    }>
  >;

  /** Mapped type of all available LSP notification methods and their handler signatures */
  export type AvailableNotifications<
    ClientCaps extends Partial<ClientCapabilities>,
    Notifications extends Partial<LSPNotification> = LSPNotification
  > = Simplify<
    RemoveNever<{
      [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{
        [Method in keyof Notifications[Namespace] as CamelCase<
          StripNamespaceSuffix<Namespace & string, Method & string>
        >]: IsClientCapabilityEnabled<ClientCaps, Notifications[Namespace][Method]> extends true
          ? Notifications[Namespace][Method]
          : never;
      }>;
    }>
  >;
}

export namespace Server {
  /** Mapped type of all available LSP request methods and their handler signatures */
  export type AvailableRequests<
    ServerCaps extends Partial<ServerCapabilities>,
    Requests extends Partial<LSPRequest> = LSPRequest
  > = Simplify<
    RemoveNever<{
      [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{
        [Method in keyof Requests[Namespace] as CamelCase<
          Method & string
        >]: IsServerCapabilityEnabled<ServerCaps, Requests[Namespace][Method]> extends true
          ? Requests[Namespace][Method]
          : never;
      }>;
    }>
  >;

  /** Mapped type of all available LSP notification methods and their handler signatures */
  export type AvailableNotifications<
    ServerCaps extends Partial<ServerCapabilities>,
    Notifications extends Partial<LSPNotification> = LSPNotification
  > = Simplify<
    RemoveNever<{
      [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{
        [Method in keyof Notifications[Namespace] as CamelCase<
          StripNamespaceSuffix<Namespace & string, Method & string>
        >]: IsServerCapabilityEnabled<ServerCaps, Notifications[Namespace][Method]> extends true
          ? Notifications[Namespace][Method]
          : never;
      }>;
    }>
  >;
}

/**
 * The complete set of available LSP methods for a client/server capability pair,
 * split by direction (client send, server send, handlers).
 *
 * @typeParam ClientCaps - The client capabilities shape.
 * @typeParam ServerCaps - The server capabilities shape.
 */
export type AvailableMethods<
  ClientCaps extends Partial<ClientCapabilities>,
  ServerCaps extends Partial<ServerCapabilities>
> = {
  client: {
    notifications: ConditionalPickDeep<
      Client.AvailableNotifications<ClientCaps>,
      { Direction: 'clientToServer' | 'both' }
    >;
    requests: ConditionalPickDeep<
      Client.AvailableRequests<ClientCaps>,
      { Direction: 'clientToServer' | 'both' }
    >;
    requestHandlers: ConditionalPickDeep<
      Client.AvailableRequests<ClientCaps>,
      { Direction: 'serverToClient' | 'both' }
    >;
    notificationHandlers: ConditionalPickDeep<
      Client.AvailableNotifications<ClientCaps>,
      { Direction: 'serverToClient' | 'both' }
    >;
  };
  server: {
    notifications: ConditionalPickDeep<
      Server.AvailableNotifications<ServerCaps>,
      { Direction: 'serverToClient' | 'both' }
    >;
    requests: ConditionalPickDeep<
      Server.AvailableRequests<ServerCaps>,
      { Direction: 'serverToClient' | 'both' }
    >;
    requestHandlers: ConditionalPickDeep<
      Server.AvailableRequests<ServerCaps>,
      { Direction: 'clientToServer' | 'both' }
    >;
    notificationHandlers: ConditionalPickDeep<
      Server.AvailableNotifications<ServerCaps>,
      { Direction: 'clientToServer' | 'both' }
    >;
  };
};

/**
 * Capability-aware interface for an LSP client, combining typed request send
 * methods, notification send methods, and server-to-client handler registrations.
 *
 * @remarks
 * `Client<ClientCaps, ServerCaps>` is the type that `LSPClient.expect<ServerCaps>()`
 * returns. Its namespaces (e.g. `client.textDocument.hover`) are only present
 * when the corresponding capability exists in `ServerCaps`.
 *
 * Obtain a `Client`-typed reference via `LSPClient.expect<MyServerCaps>()` rather
 * than constructing this type directly.
 *
 * @typeParam ClientCaps - The capabilities the client declared.
 * @typeParam ServerCaps - The capabilities the server advertised.
 */
export type Client<
  ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities,
  ServerCaps extends Partial<ServerCapabilities> = ServerCapabilities
> = SimplifyDeep<
  {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['client']['requests']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['client']['requests'][K]]: ToRequestSignature<
        AvailableMethods<ClientCaps, ServerCaps>['client']['requests'][K][Q]
      >;
    };
  } & {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['client']['notifications']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['client']['notifications'][K]]: ToNotificationSignature<
        AvailableMethods<ClientCaps, ServerCaps>['client']['notifications'][K][Q]
      >;
    };
  } & {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['client']['requestHandlers']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['client']['requestHandlers'][K] as `on${PascalCase<
        string & Q,
        { preserveConsecutiveUppercase: true }
      >}`]: ToRequestHandlerSignature<
        AvailableMethods<ClientCaps, ServerCaps>['client']['requestHandlers'][K][Q]
      >;
    };
  } & {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['client']['notificationHandlers']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['client']['notificationHandlers'][K] as `on${PascalCase<
        string & Q,
        { preserveConsecutiveUppercase: true }
      >}`]: ToNotificationHandlerSignature<
        AvailableMethods<ClientCaps, ServerCaps>['client']['notificationHandlers'][K][Q]
      >;
    };
  }
>;

/**
 * Combined Server type with handlers and send methods
 *
 * @example
 * type MyCaps = { hoverProvider: true };
 * type MyServer = Server<ClientCapabilities, MyCaps>;
 * // server.textDocument.onHover is available
 * // server.window.showMessage is available for sending
 */
export type Server<
  ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities,
  ServerCaps extends Partial<ServerCapabilities> = ServerCapabilities
> = SimplifyDeep<
  {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['server']['requests']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['server']['requests'][K]]: ToRequestSignature<
        AvailableMethods<ClientCaps, ServerCaps>['server']['requests'][K][Q]
      >;
    };
  } & {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['server']['notifications']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['server']['notifications'][K]]: ToNotificationSignature<
        AvailableMethods<ClientCaps, ServerCaps>['server']['notifications'][K][Q]
      >;
    };
  } & {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['server']['requestHandlers']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['server']['requestHandlers'][K] as `on${PascalCase<
        string & Q,
        { preserveConsecutiveUppercase: true }
      >}`]: ToRequestHandlerSignature<
        AvailableMethods<ClientCaps, ServerCaps>['server']['requestHandlers'][K][Q]
      >;
    };
  } & {
    [K in keyof AvailableMethods<ClientCaps, ServerCaps>['server']['notificationHandlers']]: {
      [Q in keyof AvailableMethods<
        ClientCaps,
        ServerCaps
      >['server']['notificationHandlers'][K] as `on${PascalCase<
        string & Q,
        { preserveConsecutiveUppercase: true }
      >}`]: ToNotificationHandlerSignature<
        AvailableMethods<ClientCaps, ServerCaps>['server']['notificationHandlers'][K][Q]
      >;
    };
  }
>;

/**
 * Runtime map from every LSP request method string to the corresponding
 * server capability key (or `undefined` for always-allowed methods).
 */
export const ClientRequestMethodToCapabilityMap: Map<string, string | undefined> = new Map(
  (Object.values(LSPRequest) as any[])
    .flatMap((ns) => Object.values(ns))
    .map((req: any) => [req.Method, req.ServerCapability] as [string, string | undefined])
);

/**
 * Runtime map from every LSP notification method string to the corresponding
 * server capability key (or `undefined` for always-allowed notifications).
 */
export const ClientNotificationMethodToCapabilityMap: Map<string, string | undefined> = new Map(
  (Object.values(LSPNotification) as any[])
    .flatMap((ns) => Object.values(ns))
    .map((notif: any) => [notif.Method, notif.ServerCapability] as [string, string | undefined])
);
