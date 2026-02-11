import { PassThrough } from 'node:stream';
import { StdioTransport } from './packages/core/dist/index.js';
import { LSPClient } from './packages/client/dist/index.js';

const inputStream = new PassThrough();
const outputStream = new PassThrough();
const transport = new StdioTransport({
  input: inputStream,
  output: outputStream
});

const client = new LSPClient({
  name: 'test-client',
  version: '1.0.0'
});

let initId = null;

outputStream.on('data', (chunk) => {
  const text = chunk.toString();
  const start = text.indexOf('{');
  if (start !== -1) {
    try {
      const message = JSON.parse(text.slice(start));
      if (message.method === 'initialize') {
        initId = message.id;
        console.log('Got init request with ID:', initId);
      } else {
        console.log('OUTPUT MESSAGE:', message);
      }
    } catch (e) {
      // ignore
    }
  }
});

// Connect and initialize
const connectPromise = client.connect(transport);

// Wait for initialize request
setTimeout(() => {
  if (!initId) {
    console.error('No init ID captured!');
    process.exit(1);
  }
  const initResponse = {
    jsonrpc: '2.0',
    id: initId,
    result: {
      capabilities: {},
      serverInfo: { name: 'test-server' }
    }
  };
  const responseStr = JSON.stringify(initResponse);
  const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
  console.log('Sending init response');
  inputStream.write(buffer);
}, 200);

await connectPromise;
console.log('Connected!');

// Now try to send a request
console.log('\nSending hover request...');
const requestPromise = client.sendRequest('textDocument/hover', {
  textDocument: { uri: 'file:///test.ts' },
  position: { line: 0, character: 5 }
});

setTimeout(() => {
  console.log('Timeout - request was never sent or response never received');
  process.exit(1);
}, 2000);

requestPromise.then(() => {
  console.log('Got response!');
  process.exit(0);
}).catch((err) => {
  console.log('Error:', err.message);
  process.exit(1);
});
