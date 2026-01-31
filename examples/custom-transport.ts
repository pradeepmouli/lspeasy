/**
 * Example: Custom HTTP Transport
 *
 * Demonstrates implementing a custom transport for LSP communication.
 * This example shows an HTTP-based transport using long polling.
 *
 * Usage:
 *   npx tsx examples/custom-transport.ts
 */

import type { Transport, Message, Disposable } from '@lspy/core';
import { EventEmitter } from 'events';
import http from 'http';

/**
 * Custom HTTP Transport using long polling
 *
 * This is a simplified example to demonstrate the Transport interface.
 * In production, consider using WebSocket instead of long polling.
 */
class HTTPTransport implements Transport {
  private messageEmitter = new EventEmitter();
  private errorEmitter = new EventEmitter();
  private closeEmitter = new EventEmitter();
  private closed = false;
  private server: http.Server | null = null;
  private messageQueue: Message[] = [];

  constructor(
    private readonly port: number,
    private readonly mode: 'server' | 'client' = 'server'
  ) {}

  async start(): Promise<void> {
    if (this.mode === 'server') {
      this.server = http.createServer((req, res) => {
        // Enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        if (req.method === 'POST' && req.url === '/message') {
          // Receive message from client
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const message = JSON.parse(body) as Message;
              this.messageEmitter.emit('message', message);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'received' }));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else if (req.method === 'GET' && req.url === '/poll') {
          // Long polling: wait for message or timeout
          if (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift()!;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(message));
          } else {
            // Wait up to 30 seconds for a message
            const timeout = setTimeout(() => {
              res.writeHead(204); // No content
              res.end();
            }, 30000);

            const listener = (message: Message) => {
              clearTimeout(timeout);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(message));
            };

            this.messageEmitter.once('outgoing', listener);
          }
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      });

      await new Promise<void>((resolve) => {
        this.server!.listen(this.port, () => {
          console.log(`HTTP Transport listening on http://localhost:${this.port}`);
          resolve();
        });
      });
    }
  }

  async send(message: Message): Promise<void> {
    if (this.closed) {
      throw new Error('Transport is closed');
    }

    if (this.mode === 'server') {
      // Queue message for client to poll
      this.messageQueue.push(message);
      this.messageEmitter.emit('outgoing', message);
    } else {
      // Client mode: POST message to server
      const data = JSON.stringify(message);

      await new Promise<void>((resolve, reject) => {
        const req = http.request(
          {
            hostname: 'localhost',
            port: this.port,
            path: '/message',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data)
            }
          },
          (res) => {
            if (res.statusCode === 200) {
              resolve();
            } else {
              reject(new Error(`HTTP ${res.statusCode}`));
            }
          }
        );

        req.on('error', reject);
        req.write(data);
        req.end();
      });
    }
  }

  async close(): Promise<void> {
    if (this.closed) {
      return;
    }

    this.closed = true;

    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => {
          resolve();
        });
      });
    }

    this.closeEmitter.emit('close');
  }

  onMessage(handler: (message: Message) => void): Disposable {
    this.messageEmitter.on('message', handler);
    return {
      dispose: () => {
        this.messageEmitter.off('message', handler);
      }
    };
  }

  onError(handler: (error: Error) => void): Disposable {
    this.errorEmitter.on('error', handler);
    return {
      dispose: () => {
        this.errorEmitter.off('error', handler);
      }
    };
  }

  onClose(handler: () => void): Disposable {
    this.closeEmitter.on('close', handler);
    return {
      dispose: () => {
        this.closeEmitter.off('close', handler);
      }
    };
  }
}

// Example usage
async function main() {
  console.log('Custom HTTP Transport Example\n');
  console.log('This demonstrates implementing a custom transport.');
  console.log('The Transport interface requires:');
  console.log('  - send(message): Send a JSON-RPC message');
  console.log('  - onMessage(handler): Register message handler');
  console.log('  - onError(handler): Register error handler');
  console.log('  - onClose(handler): Register close handler');
  console.log('  - close(): Clean up resources\n');

  const transport = new HTTPTransport(3001, 'server');

  transport.onMessage((message) => {
    console.log('Received message:', message);
  });

  transport.onError((error) => {
    console.error('Transport error:', error);
  });

  transport.onClose(() => {
    console.log('Transport closed');
  });

  await transport.start();

  console.log('\nHTTP transport started. Try sending a message:');
  console.log('  curl -X POST http://localhost:3001/message \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"jsonrpc":"2.0","method":"example","id":1}\'');
  console.log('\nPress Ctrl+C to stop...');

  // Keep running until interrupted
  await new Promise<void>((resolve) => {
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await transport.close();
      resolve();
    });
  });
}

main().catch(console.error);
