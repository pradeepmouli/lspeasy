import { PassThrough } from 'node:stream';

const stream = new PassThrough();

const parseMessage = (chunk) => {
  const text = chunk.toString('utf8');
  const start = text.indexOf('{');
  if (start === -1) {
    return undefined;
  }

  try {
    return JSON.parse(text.slice(start));
  } catch {
    return undefined;
  }
};

const captureMessage = (outputStream, method) => {
  return new Promise((resolve) => {
    let buffer = Buffer.alloc(0);

    const onData = (chunk) => {
      console.log('GOT CHUNK:', chunk.length, 'bytes');
      buffer = Buffer.concat([buffer, chunk]);
      const message = parseMessage(buffer);
      console.log('PARSED:', message);
      if (message?.method === method && message.id !== undefined) {
        outputStream.off('data', onData);
        resolve(message.id);
      }
    };

    outputStream.on('data', onData);
  });
};

// Test 1: Send a message immediately
console.log('Test 1: Immediate send');
const promise1 = captureMessage(stream, 'test1');
const msg1 = JSON.stringify({ jsonrpc: '2.0', id: '123', method: 'test1' });
stream.write(Buffer.from(`Content-Length: ${msg1.length}\r\n\r\n${msg1}`));
const id1 = await promise1;
console.log('Captured ID:', id1);

// Test 2: Send a message after listener is attached
console.log('\nTest 2: Delayed send');
const promise2 = captureMessage(stream, 'test2');
setTimeout(() => {
  const msg2 = JSON.stringify({ jsonrpc: '2.0', id: '456', method: 'test2' });
  stream.write(Buffer.from(`Content-Length: ${msg2.length}\r\n\r\n${msg2}`));
}, 100);
const id2 = await promise2;
console.log('Captured ID:', id2);

console.log('\nAll tests passed!');
process.exit(0);
