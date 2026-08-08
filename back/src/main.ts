import pino from 'pino';
import { loadConfig } from './config/env.js';
import { createBackendServer } from './infrastructure/http/server.js';

const config = loadConfig();
const logger = pino({ level: config.LOG_LEVEL });

const server = createBackendServer({ logger });

server.listen(config.PORT, () => {
  logger.info({ port: config.PORT, orderExecutionEnabled: false }, 'Trading AI Agent backend listening');
});

const shutdown = () => server.close((error) => {
  if (error) {
    logger.error({ error }, 'Backend shutdown failed');
    process.exitCode = 1;
  }
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
