import { PassThrough } from 'node:stream';

const stream = new PassThrough();

// Write some data without any listeners
console.log('Writing data with no listeners...');
stream.write(Buffer.from('OLD DATA\n'));

// Now attach a listener
console.log('Attaching listener...');
stream.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});

// Write more data
console.log('Writing more data...');
stream.write(Buffer.from('NEW DATA\n'));

setTimeout(() => {
  process.exit(0);
}, 100);
