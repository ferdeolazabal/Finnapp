import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { createRequestLogger } from './request-logger.js';
import type { HttpLogger } from './types.js';

export type BackendServerOptions = {
  logger: HttpLogger;
  createCorrelationId?: () => string;
  now?: () => Date;
};

const getCorrelationId = (
  header: string | string[] | undefined,
  createCorrelationId: () => string,
): string => {
  const supplied = Array.isArray(header) ? header[0] : header;
  return supplied?.trim() || createCorrelationId();
};

export const createBackendServer = ({
  logger,
  createCorrelationId = randomUUID,
  now = () => new Date(),
}: BackendServerOptions) => {
  const requestLogger = createRequestLogger(logger);

  return createServer((request, response) => {
    const correlationId = getCorrelationId(request.headers['x-correlation-id'], createCorrelationId);
    response.setHeader('x-correlation-id', correlationId);

    requestLogger(request, response, () => {
      const path = new URL(request.url ?? '/', 'http://localhost').pathname;

      if (request.method === 'GET' && path === '/health') {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({
          status: 'ok',
          timestamp: now().toISOString(),
          orderExecutionEnabled: false,
        }));
        return;
      }

      response.writeHead(404, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: 'NOT_FOUND', correlationId }));
    });
  });
};
