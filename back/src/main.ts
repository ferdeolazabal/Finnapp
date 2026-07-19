import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import pino from 'pino';
import { loadConfig } from './config/env.js';

const config = loadConfig();
const logger = pino({ level: config.LOG_LEVEL });

const server = createServer((request, response) => {
  const correlationId = request.headers['x-correlation-id'] ?? randomUUID();
  response.setHeader('x-correlation-id', correlationId);

  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      orderExecutionEnabled: false,
    }));
    return;
  }

  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'NOT_FOUND', correlationId }));
});

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
