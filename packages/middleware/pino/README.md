# @lspeasy/middleware-pino

Pino-compatible structured logging middleware for lspeasy middleware pipelines.

## Installation

```bash
pnpm add @lspeasy/middleware-pino pino
```

## Usage

```typescript
import pino from 'pino';
import { LSPClient } from '@lspeasy/client';
import { createPinoMiddleware } from '@lspeasy/middleware-pino';

const logger = pino({ level: 'info' });

const client = new LSPClient({
	name: 'logging-client',
	version: '1.0.0',
	middleware: [
		createPinoMiddleware(logger, {
			level: 'debug',
			includeMessageContent: false,
			staticFields: {
				service: 'lsp-client'
			}
		})
	]
});
```

## Options

- `level`: logging level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`)
- `includeMessageContent`: include full JSON-RPC message payload in log records
- `staticFields`: fixed metadata included in every log record
- `formatMessage`: custom formatter for emitted log messages

## Behavior

- Emits a `before` log event prior to the next middleware/handler.
- Emits an `after` log event on successful completion with `durationMs`.
- Emits an `error` log event when downstream middleware/handler throws.
