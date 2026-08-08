import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBackendServer } from '../src/infrastructure/http/server.js';

const openServers: ReturnType<typeof createBackendServer>[] = [];

afterEach(async () => {
  await Promise.all(openServers.splice(0).map((server) => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  })));
});

const startServer = async (logger: { info: ReturnType<typeof vi.fn> }) => {
  const server = createBackendServer({
    logger,
    createCorrelationId: () => 'generated-correlation-id',
    now: () => new Date('2026-01-01T00:00:00.000Z'),
  });
  openServers.push(server);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${port}`;
};

describe('HTTP server', () => {
  it('serves health with a correlation ID', async () => {
    const logger = { info: vi.fn() };
    const baseUrl = await startServer(logger);

    const response = await fetch(`${baseUrl}/health`, {
      headers: { 'x-correlation-id': 'test-correlation-id' },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('x-correlation-id')).toBe('test-correlation-id');
    await expect(response.json()).resolves.toEqual({
      status: 'ok',
      timestamp: '2026-01-01T00:00:00.000Z',
      orderExecutionEnabled: false,
    });
  });

  it('logs request metadata without query strings, headers or bodies', async () => {
    const logger = { info: vi.fn() };
    const baseUrl = await startServer(logger);

    const response = await fetch(`${baseUrl}/missing?token=must-not-be-logged`, {
      method: 'POST',
      headers: { authorization: 'Bearer must-not-be-logged' },
      body: JSON.stringify({ password: 'must-not-be-logged' }),
    });
    await response.arrayBuffer();

    expect(response.status).toBe(404);
    expect(logger.info).toHaveBeenCalledOnce();
    expect(logger.info).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      path: '/missing',
      statusCode: 404,
      correlationId: 'generated-correlation-id',
      durationMs: expect.any(Number),
    }), 'HTTP request completed');
    expect(JSON.stringify(logger.info.mock.calls)).not.toContain('must-not-be-logged');
  });
});
