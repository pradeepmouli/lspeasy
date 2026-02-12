export interface MiddlewareContextLike {
  direction: 'clientToServer' | 'serverToClient';
  messageType: 'request' | 'response' | 'notification' | 'error';
  method: string;
  message: unknown;
  transport: string;
}

export interface MiddlewareResultLike {
  shortCircuit?: boolean;
}

export type MiddlewareLike = (
  context: MiddlewareContextLike,
  next: () => Promise<void | MiddlewareResultLike>
) => Promise<void | MiddlewareResultLike>;

export type PinoLikeLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface PinoLikeLogger {
  trace?: (payload: Record<string, unknown>, message?: string) => void;
  debug?: (payload: Record<string, unknown>, message?: string) => void;
  info?: (payload: Record<string, unknown>, message?: string) => void;
  warn?: (payload: Record<string, unknown>, message?: string) => void;
  error?: (payload: Record<string, unknown>, message?: string) => void;
  fatal?: (payload: Record<string, unknown>, message?: string) => void;
}

export interface PinoMiddlewareOptions {
  level?: PinoLikeLevel;
  includeMessageContent?: boolean;
  staticFields?: Record<string, unknown>;
  formatMessage?: (context: {
    phase: 'before' | 'after' | 'error';
    direction: 'clientToServer' | 'serverToClient';
    method: string;
    messageType: 'request' | 'response' | 'notification' | 'error';
  }) => string;
}

const defaultOptions: Required<
  Pick<PinoMiddlewareOptions, 'level' | 'includeMessageContent' | 'staticFields' | 'formatMessage'>
> = {
  level: 'info',
  includeMessageContent: false,
  staticFields: {},
  formatMessage: ({ phase, direction, method, messageType }) =>
    `lsp.${phase} ${direction} ${messageType} ${method}`
};

function toErrorPayload(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return {
    message: String(error)
  };
}

function emit(
  logger: PinoLikeLogger,
  level: PinoLikeLevel,
  payload: Record<string, unknown>,
  message: string
): void {
  const target = logger[level] ?? logger.info;
  if (!target) {
    return;
  }
  target(payload, message);
}

export function createPinoMiddleware(
  logger: PinoLikeLogger,
  options: PinoMiddlewareOptions = {}
): MiddlewareLike {
  const resolved = {
    ...defaultOptions,
    ...options,
    staticFields: {
      ...defaultOptions.staticFields,
      ...options.staticFields
    }
  };

  const middleware: MiddlewareLike = async (context, next) => {
    const startedAt = Date.now();
    const basePayload: Record<string, unknown> = {
      ...resolved.staticFields,
      direction: context.direction,
      messageType: context.messageType,
      method: context.method,
      transport: context.transport
    };

    if (resolved.includeMessageContent) {
      basePayload['message'] = context.message;
    }

    emit(
      logger,
      resolved.level,
      basePayload,
      resolved.formatMessage({
        phase: 'before',
        direction: context.direction,
        method: context.method,
        messageType: context.messageType
      })
    );

    try {
      const result = await next();
      emit(
        logger,
        resolved.level,
        {
          ...basePayload,
          durationMs: Date.now() - startedAt,
          shortCircuit: result?.shortCircuit ?? false
        },
        resolved.formatMessage({
          phase: 'after',
          direction: context.direction,
          method: context.method,
          messageType: context.messageType
        })
      );
      return result;
    } catch (error) {
      emit(
        logger,
        'error',
        {
          ...basePayload,
          durationMs: Date.now() - startedAt,
          error: toErrorPayload(error)
        },
        resolved.formatMessage({
          phase: 'error',
          direction: context.direction,
          method: context.method,
          messageType: context.messageType
        })
      );
      throw error;
    }
  };

  return middleware;
}
