import type {
  ErrorResponseMessage,
  Message,
  NotificationMessage,
  RequestMessage,
  ResponseMessage
} from '../jsonrpc/messages.js';
import type {
  LSPNotificationMethod,
  LSPRequestMethod,
  ParamsForNotification,
  ParamsForRequest,
  ResultForRequest
} from '../protocol/infer.js';

export type MiddlewareDirection = 'clientToServer' | 'serverToClient';

export type MiddlewareMessageType = 'request' | 'response' | 'notification' | 'error';

type ImmutableId<T> = T extends { id: infer I } ? Omit<T, 'id'> & { readonly id: I } : T;

export type MiddlewareMessage = ImmutableId<Message>;

export interface MiddlewareContext {
  direction: MiddlewareDirection;
  messageType: MiddlewareMessageType;
  method: string;
  message: MiddlewareMessage;
  metadata: Record<string, unknown>;
  transport: string;
}

export type LSPMethod = LSPRequestMethod | LSPNotificationMethod;

export type TypedParams<M extends LSPMethod> = M extends LSPRequestMethod
  ? ParamsForRequest<M>
  : M extends LSPNotificationMethod
    ? ParamsForNotification<M>
    : never;

export type TypedResult<M extends LSPMethod> = M extends LSPRequestMethod
  ? ResultForRequest<M>
  : void;

export interface TypedMiddlewareContext<M extends LSPMethod> extends MiddlewareContext {
  method: M;
  params: TypedParams<M>;
  result?: TypedResult<M>;
}

export interface MiddlewareResult {
  shortCircuit?: boolean;
  response?: ResponseMessage | RequestMessage | NotificationMessage;
  error?: ErrorResponseMessage;
}

export type MiddlewareNext = () => Promise<void | MiddlewareResult>;

export type Middleware = (
  context: MiddlewareContext,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

export type TypedMiddleware<M extends LSPMethod> = (
  context: TypedMiddlewareContext<M>,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

export interface MethodFilter {
  methods: string[] | RegExp;
  direction?: MiddlewareDirection | 'both';
  messageType?: MiddlewareMessageType[];
}

export interface ScopedMiddleware {
  filter: MethodFilter;
  middleware: Middleware;
}
