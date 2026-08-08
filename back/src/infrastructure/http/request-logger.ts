import type { IncomingMessage } from 'node:http';
import morgan from 'morgan';
import type { HttpLogger } from './types.js';

type HttpLog = {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  correlationId: string;
};

const getPath = (request: IncomingMessage): string => {
  try {
    return new URL(request.url ?? '/', 'http://localhost').pathname;
  } catch {
    return '/';
  }
};

export const createRequestLogger = (logger: HttpLogger) => morgan((tokens, request, response) => {
  const duration = Number(tokens['response-time']?.(request, response));
  const log: HttpLog = {
    method: tokens.method?.(request, response) ?? 'UNKNOWN',
    path: getPath(request),
    statusCode: Number(tokens.status?.(request, response) ?? response.statusCode),
    durationMs: Number.isFinite(duration) ? duration : 0,
    correlationId: String(response.getHeader('x-correlation-id') ?? 'missing'),
  };

  return JSON.stringify(log);
}, {
  stream: {
    write: (message) => {
      const log = JSON.parse(message) as HttpLog;
      logger.info(log, 'HTTP request completed');
    },
  },
});
