#!/usr/bin/env node
import pino from 'pino';

const logger = pino({
  level: process.env['LOG_LEVEL'] || 'info'
});

async function main(): Promise<void> {
  logger.info('TypeScript template started');

  // Your application code here

  logger.info('Application running successfully');
}

main().catch((error) => {
  logger.error({ error }, 'Application failed to start');
  process.exit(1);
});
