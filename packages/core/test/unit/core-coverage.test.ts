import { describe, expect, it, vi } from 'vitest';
import {
  serverSupportsRequest,
  serverSupportsNotification,
  clientSupportsRequest,
  clientSupportsNotification,
  hasServerCapability,
  supportsHover,
  supportsCompletion,
  supportsDefinition,
  supportsReferences,
  supportsDocumentSymbol,
  supportsWorkspaceFolders,
  supportsNotebookDocumentSync,
  hasClientCapability,
  supportsFileWatching,
  supportsWorkDoneProgress
} from '../../src/protocol/capabilities.js';
import {
  createProgressBegin,
  createProgressCreateParams,
  createProgressEnd,
  createProgressReport,
  createProgressToken
} from '../../src/protocol/progress.js';
import {
  createPartialResultParams,
  getPartialResultToken,
  hasPartialResultToken
} from '../../src/protocol/partial.js';
import {
  isRegisterCapabilityParams,
  isUnregisterCapabilityParams
} from '../../src/protocol/dynamic-registration.js';
import {
  createWorkspaceFolder,
  createWorkspaceFoldersChangeEvent,
  FileChangeTypes
} from '../../src/protocol/workspace.js';
import {
  createDidChangeWatchedFilesParams,
  createFileEvent,
  createFileSystemWatcher,
  WatchKinds
} from '../../src/protocol/watching.js';
import {
  CompletionParamsSchema,
  DidOpenTextDocumentParamsSchema,
  HoverParamsSchema,
  InitializeParamsSchema,
  RangeSchema
} from '../../src/protocol/schemas.js';
import {
  isErrorResponse,
  isNotificationMessage,
  isRequestMessage,
  isResponseMessage,
  isSuccessResponse,
  type ErrorResponseMessage,
  type NotificationMessage,
  type RequestMessage,
  type SuccessResponseMessage
} from '../../src/jsonrpc/messages.js';
import { TransportEventEmitter } from '../../src/transport/events.js';
import { ErrorMessage, JSONRPCErrorCode, ResponseError } from '../../src/utils/errors.js';
import { DisposableStore, type Disposable } from '../../src/utils/disposable.js';
import { ConsoleLogger, LogLevel, NullLogger } from '../../src/utils/logger.js';
import {
  RequestMethodMap,
  getCapabilityForNotificationMethod,
  getCapabilityForRequestMethod,
  getClientCapabilityForNotificationMethod,
  getClientCapabilityForRequestMethod,
  getDefinitionForNotification,
  getDefinitionForRequest
} from '../../src/protocol/infer.js';
import type { ServerCapabilities } from 'vscode-languageserver-protocol';

describe('core protocol and utility coverage', () => {
  it('evaluates capability helpers across positive and negative paths', () => {
    const serverCaps: ServerCapabilities = {
      hoverProvider: true,
      notebookDocumentSync: { notebookSelector: [] }
    };

    expect(serverSupportsRequest('textDocument/hover', serverCaps)).toBe(true);
    expect(supportsHover(serverCaps)).toBe(true);
    expect(supportsNotebookDocumentSync(serverCaps)).toBe(true);
    expect(hasServerCapability(serverCaps, 'hoverProvider')).toBe(true);
    expect(hasServerCapability(serverCaps, 'definitionProvider')).toBe(false);

    const clientCaps = {
      workspace: { didChangeWatchedFiles: { dynamicRegistration: true } },
      window: { workDoneProgress: true }
    };

    expect(hasClientCapability(clientCaps, 'window.workDoneProgress')).toBe(true);
    expect(supportsFileWatching(clientCaps)).toBe(true);
    expect(supportsWorkDoneProgress(clientCaps)).toBe(true);
  });

  it('covers additional capability helper branches', () => {
    const richServerCaps: ServerCapabilities = {
      hoverProvider: true,
      completionProvider: { resolveProvider: true },
      definitionProvider: true,
      referencesProvider: true,
      documentSymbolProvider: true,
      workspace: { workspaceFolders: { supported: true, changeNotifications: true } }
    };

    expect(
      serverSupportsNotification('textDocument/didOpen', { textDocumentSync: { openClose: true } })
    ).toBe(true);
    expect(serverSupportsNotification('textDocument/didOpen', {})).toBe(false);
    expect(serverSupportsNotification('workspace/didChangeConfiguration', {})).toBe(true);

    expect(clientSupportsRequest('workspace/applyEdit', { workspace: { applyEdit: true } })).toBe(
      true
    );
    expect(clientSupportsRequest('workspace/applyEdit', {})).toBe(false);
    expect(
      clientSupportsNotification('workspace/didChangeConfiguration', {
        workspace: { didChangeConfiguration: { dynamicRegistration: true } }
      })
    ).toBe(true);
    expect(clientSupportsNotification('workspace/didChangeConfiguration', {})).toBe(false);

    expect(supportsCompletion(richServerCaps)).toBe(true);
    expect(supportsDefinition(richServerCaps)).toBe(true);
    expect(supportsReferences(richServerCaps)).toBe(true);
    expect(supportsDocumentSymbol(richServerCaps)).toBe(true);
    expect(supportsWorkspaceFolders(richServerCaps)).toBe(true);

    expect(supportsWorkspaceFolders({})).toBe(false);
    expect(supportsCompletion({ hoverProvider: true })).toBe(false);
  });

  it('creates and parses progress and partial-result helpers', () => {
    const begin = createProgressBegin('indexing', true, 'starting', 25);
    expect(begin).toEqual({
      kind: 'begin',
      title: 'indexing',
      cancellable: true,
      message: 'starting',
      percentage: 25
    });

    const report = createProgressReport('half', 50, false);
    expect(report).toEqual({ kind: 'report', message: 'half', percentage: 50, cancellable: false });

    const emptyReport = createProgressReport(undefined, 0, undefined);
    expect(emptyReport).toEqual({ kind: 'report' });

    const end = createProgressEnd('done');
    expect(end).toEqual({ kind: 'end', message: 'done' });

    const token = createProgressToken();
    expect(typeof token).toBe('string');
    expect(token).toContain('progress-');
    expect(createProgressCreateParams(token)).toEqual({ token });

    const partial = createPartialResultParams('t-1');
    expect(hasPartialResultToken(partial)).toBe(true);
    expect(getPartialResultToken(partial)).toBe('t-1');
    expect(hasPartialResultToken({})).toBe(false);
  });

  it('validates dynamic registration payload guards', () => {
    expect(
      isRegisterCapabilityParams({
        registrations: [
          { id: '1', method: 'workspace/didChangeConfiguration', registerOptions: {} }
        ]
      })
    ).toBe(true);
    expect(isRegisterCapabilityParams({ registrations: [{ id: '', method: '' }] })).toBe(false);

    expect(
      isUnregisterCapabilityParams({
        unregisterations: [{ id: '1', method: 'workspace/didChangeWatchedFiles' }]
      })
    ).toBe(true);
    expect(isUnregisterCapabilityParams({ unregisterations: [{ id: '', method: '' }] })).toBe(
      false
    );
  });

  it('parses representative protocol schemas', () => {
    expect(
      RangeSchema.parse({
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 }
      })
    ).toBeDefined();

    expect(
      HoverParamsSchema.parse({
        textDocument: { uri: 'file:///a.ts' },
        position: { line: 1, character: 2 }
      })
    ).toBeDefined();

    expect(
      CompletionParamsSchema.parse({
        textDocument: { uri: 'file:///a.ts' },
        position: { line: 1, character: 2 },
        partialResultToken: 'p1'
      })
    ).toBeDefined();

    expect(
      DidOpenTextDocumentParamsSchema.parse({
        textDocument: {
          uri: 'file:///a.ts',
          languageId: 'typescript',
          version: 1,
          text: 'const a = 1;'
        }
      })
    ).toBeDefined();

    expect(
      InitializeParamsSchema.parse({
        processId: null,
        rootUri: null,
        capabilities: {}
      })
    ).toBeDefined();
  });

  it('covers workspace and file-watching helpers', () => {
    const folder = createWorkspaceFolder('file:///repo', 'repo');
    expect(folder).toEqual({ uri: 'file:///repo', name: 'repo' });

    const change = createWorkspaceFoldersChangeEvent([folder], []);
    expect(change.added).toHaveLength(1);
    expect(FileChangeTypes.Created).toBe(1);
    expect(FileChangeTypes.Changed).toBe(2);
    expect(FileChangeTypes.Deleted).toBe(3);

    const event = createFileEvent('file:///repo/a.ts', FileChangeTypes.Changed);
    expect(event.type).toBe(2);

    expect(createFileSystemWatcher('**/*.ts')).toEqual({ globPattern: '**/*.ts' });
    expect(createFileSystemWatcher('**/*.ts', WatchKinds.All)).toEqual({
      globPattern: '**/*.ts',
      kind: 7
    });
    expect(createDidChangeWatchedFilesParams([event]).changes).toHaveLength(1);
  });

  it('covers message guards and transport events', () => {
    const request: RequestMessage = { jsonrpc: '2.0', id: 1, method: 'initialize' };
    const notification: NotificationMessage = { jsonrpc: '2.0', method: 'exit' };
    const success: SuccessResponseMessage = { jsonrpc: '2.0', id: 1, result: null };
    const error: ErrorResponseMessage = {
      jsonrpc: '2.0',
      id: 1,
      error: { code: JSONRPCErrorCode.InternalError, message: 'oops' }
    };

    expect(isRequestMessage(request)).toBe(true);
    expect(isNotificationMessage(notification)).toBe(true);
    expect(isResponseMessage(success)).toBe(true);
    expect(isSuccessResponse(success)).toBe(true);
    expect(isErrorResponse(error)).toBe(true);

    const emitter = new TransportEventEmitter();
    const onConnect = vi.fn();
    const onDisconnect = vi.fn();
    const onError = vi.fn();
    const onMessage = vi.fn();

    emitter.on('connect', onConnect);
    emitter.on('disconnect', onDisconnect);
    emitter.on('error', onError);
    emitter.on('message', onMessage);

    emitter.emitConnect();
    emitter.emitDisconnect();
    emitter.emitError(new Error('transport-error'));
    emitter.emitMessage(request);

    expect(onConnect).toHaveBeenCalledTimes(1);
    expect(onDisconnect).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith(request);
  });

  it('covers error, disposable and logger utilities', () => {
    expect(ErrorMessage[JSONRPCErrorCode.ParseError]).toBe('Parse error');

    const parse = ResponseError.parseError();
    const invalid = ResponseError.invalidRequest();
    const methodNotFound = ResponseError.methodNotFound('x');
    const params = ResponseError.invalidParams();
    const internal = ResponseError.internalError();
    const uninit = ResponseError.serverNotInitialized();
    const cancelled = ResponseError.requestCancelled();

    expect(parse.code).toBe(JSONRPCErrorCode.ParseError);
    expect(invalid.code).toBe(JSONRPCErrorCode.InvalidRequest);
    expect(methodNotFound.code).toBe(JSONRPCErrorCode.MethodNotFound);
    expect(params.code).toBe(JSONRPCErrorCode.InvalidParams);
    expect(internal.code).toBe(JSONRPCErrorCode.InternalError);
    expect(uninit.code).toBe(JSONRPCErrorCode.ServerNotInitialized);
    expect(cancelled.code).toBe(JSONRPCErrorCode.RequestCancelled);
    expect(parse.toJSON().code).toBe(JSONRPCErrorCode.ParseError);

    const disposeOne = vi.fn();
    const disposeTwo = vi.fn();
    const store = new DisposableStore();

    store.add({ dispose: disposeOne } satisfies Disposable);
    store.add({ dispose: disposeTwo } satisfies Disposable);
    store.dispose();

    expect(disposeTwo).toHaveBeenCalledTimes(1);
    expect(disposeOne).toHaveBeenCalledTimes(1);
    expect(store.isDisposed()).toBe(true);

    const immediate = vi.fn();
    store.add({ dispose: immediate } satisfies Disposable);
    expect(immediate).toHaveBeenCalledTimes(1);

    const store2 = new DisposableStore();
    const notDisposed = vi.fn();
    store2.add({ dispose: notDisposed } satisfies Disposable);
    store2.clear();
    store2.dispose();
    expect(notDisposed).toHaveBeenCalledTimes(0);

    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    const logger = new ConsoleLogger(LogLevel.Trace);
    logger.debug('d');
    logger.info('i');
    logger.warn('w');
    logger.error('e');
    logger.trace('t');

    expect(debug).toHaveBeenCalled();
    expect(info).toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    expect(error).toHaveBeenCalled();
    expect(log).toHaveBeenCalled();

    debug.mockRestore();
    info.mockRestore();
    warn.mockRestore();
    error.mockRestore();
    log.mockRestore();

    const nullLogger = new NullLogger();
    expect(() => {
      nullLogger.error();
      nullLogger.warn();
      nullLogger.info();
      nullLogger.debug();
      nullLogger.trace();
    }).not.toThrow();
  });

  it('covers infer method maps and lookup helpers', () => {
    expect(RequestMethodMap.has('initialize')).toBe(true);
    expect(getCapabilityForRequestMethod('textDocument/hover')).toBe('hoverProvider');
    expect(getClientCapabilityForRequestMethod('workspace/applyEdit')).toBe('workspace.applyEdit');

    expect(getCapabilityForNotificationMethod('textDocument/didOpen')).toBe(
      'textDocumentSync.openClose'
    );
    expect(getClientCapabilityForNotificationMethod('workspace/didChangeConfiguration')).toBe(
      'workspace.didChangeConfiguration'
    );

    const initializeDef = getDefinitionForRequest('Lifecycle', 'Initialize');
    expect(initializeDef.Method).toBe('initialize');

    const exitDef = getDefinitionForNotification('Lifecycle', 'Exit');
    expect(exitDef.Method).toBe('exit');
  });
});
